import { useRef, useState } from 'react';
import { HomeDashboard } from './components/HomeDashboard';
import { MindMapPage } from './components/MindMapPage';
import { NotesFromPptPage } from './components/NotesFromPptPage';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { StoryDoodlesPage } from './components/StoryDoodlesPage';
import { TopBar } from './components/TopBar';
import {
  AppPreferencesProvider,
  useAppPreferences,
} from './context/AppPreferencesContext';
import { PRESET_STORIES, type PresetStory } from './data/presetStories';
import type {
  AppPage,
  DrawingStyle,
  PptMindMapData,
  PptNotesData,
  SceneState,
  StoryAnalysis,
  ViewMode,
} from './types';
import { exportMindMapToPng } from './utils/exportMindMapPng';
import { exportStoryToPng } from './utils/exportPng';
import { buildMindMapData, collectAllNodeIds, type RawPptApiResponse } from './utils/pptTree';

async function fileToBase64(file: File): Promise<string> {
  const arrayBuf = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function SparkPadShell() {
  const { resetPreferences } = useAppPreferences();

  const [activePage, setActivePage] = useState<AppPage>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Story Doodles state
  const [activeSource, setActiveSource] = useState<'custom' | string>('custom');
  const [story, setStory] = useState('');
  const [sceneCount, setSceneCount] = useState(6);
  const [drawingStyle, setDrawingStyle] = useState<DrawingStyle>('Soft crayon doodle');
  const [maxImages, setMaxImages] = useState(12);
  const [storyViewMode, setStoryViewMode] = useState<Exclude<ViewMode, 'ppt-mindmap'>>('vertical');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExportingStoryPng, setIsExportingStoryPng] = useState(false);
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null);
  const [scenes, setScenes] = useState<SceneState[]>([]);
  const [activeStyleUsed, setActiveStyleUsed] = useState<DrawingStyle>('Soft crayon doodle');
  const [statusNote, setStatusNote] = useState<{
    type: 'muted' | 'status' | 'error';
    text: string;
  }>({
    type: 'muted',
    text: 'Pick a quick story or paste your own to get started.',
  });

  // Mind Map for PPT state
  const [pptMindMap, setPptMindMap] = useState<PptMindMapData | null>(null);
  const [isAnalyzingPpt, setIsAnalyzingPpt] = useState(false);
  const [pptError, setPptError] = useState<string | null>(null);
  const [isExportingMindMapPng, setIsExportingMindMapPng] = useState(false);

  // Notes from PPT state
  const [pptNotes, setPptNotes] = useState<PptNotesData | null>(null);
  const [isExtractingNotes, setIsExtractingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  // Track active generation run so starting a new story cancels stale scene updates
  const runIdRef = useRef(0);

  const generateSingleSceneSvg = async (
    runId: number,
    scene: SceneState,
    storyTitle: string,
    style: DrawingStyle,
    characterSheet: StoryAnalysis['character_sheet'],
  ) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === scene.id ? { ...s, status: 'loading', errorMessage: undefined } : s,
      ),
    );

    try {
      const response = await fetch('/api/generate-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle,
          drawingStyle: style,
          characterSheet,
          scene: {
            title: scene.title,
            setting: scene.setting,
            mood: scene.mood,
            action: scene.action,
            characters: scene.characters,
            image_prompt: scene.image_prompt,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.svg) {
        throw new Error(data.error || 'Could not draw this scene.');
      }

      if (runIdRef.current !== runId) return;

      setScenes((prev) =>
        prev.map((s) =>
          s.id === scene.id
            ? { ...s, svg: data.svg, status: 'ready', errorMessage: undefined }
            : s,
        ),
      );
    } catch (err) {
      if (runIdRef.current !== runId) return;
      const msg = err instanceof Error ? err.message : 'Drawing failed.';
      setScenes((prev) =>
        prev.map((s) =>
          s.id === scene.id ? { ...s, status: 'error', errorMessage: msg } : s,
        ),
      );
    }
  };

  const runIllustrate = async (storyText: string, styleToUse: DrawingStyle) => {
    const trimmedStory = storyText.trim();
    if (!trimmedStory) return;

    const currentRunId = runIdRef.current + 1;
    runIdRef.current = currentRunId;

    setIsAnalyzing(true);
    setStatusNote({
      type: 'status',
      text: 'Finding story moments and building your character sheet…',
    });

    try {
      const response = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: trimmedStory,
          sceneCount,
          drawingStyle: styleToUse,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze your story.');
      }

      if (runIdRef.current !== currentRunId) return;

      const storyAnalysis = data as StoryAnalysis;
      const limit = Math.max(1, Math.min(20, maxImages));
      const initialScenes: SceneState[] = storyAnalysis.scenes.map((scene, idx) => ({
        ...scene,
        id: `scene-${currentRunId}-${idx}`,
        index: idx,
        svg: null,
        status: idx < limit ? 'loading' : 'skipped',
      }));

      setAnalysis(storyAnalysis);
      setScenes(initialScenes);
      setActiveStyleUsed(styleToUse);
      setIsAnalyzing(false);

      const scenesToDraw = initialScenes.filter((s) => s.status === 'loading');
      setStatusNote({
        type: 'status',
        text: `Drawing ${scenesToDraw.length} of ${initialScenes.length} scenes in ${styleToUse}…`,
      });

      // Generate SVGs with concurrency of 2 so each scene pops in quickly and smoothly
      const queue = [...scenesToDraw];
      const workers = Array.from({ length: Math.min(2, queue.length) }, async () => {
        while (queue.length > 0) {
          if (runIdRef.current !== currentRunId) return;
          const nextScene = queue.shift();
          if (!nextScene) return;
          await generateSingleSceneSvg(
            currentRunId,
            nextScene,
            storyAnalysis.story_title,
            styleToUse,
            storyAnalysis.character_sheet,
          );
        }
      });

      await Promise.all(workers);

      if (runIdRef.current === currentRunId) {
        setStatusNote({
          type: 'status',
          text: 'All doodles ready! Click any card’s Edit prompt to tweak or Redraw.',
        });
      }
    } catch (err) {
      if (runIdRef.current !== currentRunId) return;
      setIsAnalyzing(false);
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong while reading your story. Please try again.';
      setStatusNote({
        type: 'error',
        text: message,
      });
    }
  };

  const handleSelectPreset = (preset: PresetStory) => {
    setIsModalOpen(false);
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;

    setIsAnalyzing(false);
    setActiveSource(preset.id);
    setDrawingStyle(preset.recommendedStyle);
    setSceneCount(preset.analysis.scenes.length);
    setActiveStyleUsed(preset.recommendedStyle);
    setAnalysis(preset.analysis);

    const limit = Math.max(1, Math.min(20, maxImages));
    const preloadedScenes: SceneState[] = preset.analysis.scenes.map((scene, idx) => {
      const svg = preset.svgs[idx] ?? null;
      const withinLimit = idx < limit;
      return {
        ...scene,
        id: `scene-${currentRunId}-${idx}`,
        index: idx,
        svg: withinLimit ? svg : null,
        status: withinLimit && svg ? 'ready' : 'skipped',
      };
    });

    setScenes(preloadedScenes);
    setStatusNote({
      type: 'status',
      text: `Loaded "${preset.title}"! Click Edit prompt or Redraw on any card to customize.`,
    });
  };

  const handleSelectCustomTab = () => {
    setActiveSource('custom');
  };

  const handleConfirmIllustrate = async () => {
    setIsModalOpen(false);
    const activePreset = PRESET_STORIES.find((p) => p.id === activeSource);
    const targetText = activePreset ? activePreset.text : story;
    await runIllustrate(targetText, drawingStyle);
  };

  const handleRedrawScene = (sceneId: string, newPrompt: string) => {
    if (!analysis) return;
    const target = scenes.find((s) => s.id === sceneId);
    if (!target) return;

    const updatedScene: SceneState = {
      ...target,
      image_prompt: newPrompt,
    };

    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, image_prompt: newPrompt } : s)),
    );

    void generateSingleSceneSvg(
      runIdRef.current,
      updatedScene,
      analysis.story_title,
      activeStyleUsed,
      analysis.character_sheet,
    );
  };

  const handleRetryScene = (sceneId: string) => {
    if (!analysis) return;
    const target = scenes.find((s) => s.id === sceneId);
    if (!target) return;
    void generateSingleSceneSvg(
      runIdRef.current,
      target,
      analysis.story_title,
      activeStyleUsed,
      analysis.character_sheet,
    );
  };

  const handleExportStoryPng = async () => {
    if (!analysis || scenes.length === 0) return;
    setIsExportingStoryPng(true);
    try {
      await exportStoryToPng({
        storyTitle: analysis.story_title,
        subtitle: analysis.subtitle,
        drawingStyle: activeStyleUsed,
        scenes,
      });
    } catch (err) {
      setStatusNote({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not export PNG.',
      });
    } finally {
      setIsExportingStoryPng(false);
    }
  };

  const handleUploadPptFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.ppt') && !lowerName.endsWith('.pptx')) {
      setPptError('Please select a PowerPoint file (.ppt or .pptx).');
      return;
    }

    setPptError(null);
    setIsAnalyzingPpt(true);

    try {
      const fileBase64 = await fileToBase64(file);
      const response = await fetch('/api/analyze-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileBase64,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not analyze this PowerPoint presentation.');
      }

      const structured = buildMindMapData(data as RawPptApiResponse);
      setPptMindMap(structured);
    } catch (err) {
      setPptError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while analyzing your PowerPoint presentation.',
      );
    } finally {
      setIsAnalyzingPpt(false);
    }
  };

  const handleExportMindMapPng = async () => {
    if (!pptMindMap) return;
    setIsExportingMindMapPng(true);
    try {
      await exportMindMapToPng(
        pptMindMap,
        new Set(collectAllNodeIds(pptMindMap.root)),
      );
    } catch (err) {
      setPptError(err instanceof Error ? err.message : 'Could not export Mind Map PNG.');
    } finally {
      setIsExportingMindMapPng(false);
    }
  };

  const handleUploadNotesPptFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.ppt') && !lowerName.endsWith('.pptx')) {
      setNotesError('Please select a PowerPoint file (.ppt or .pptx).');
      return;
    }

    setNotesError(null);
    setIsExtractingNotes(true);

    try {
      const fileBase64 = await fileToBase64(file);
      const response = await fetch('/api/extract-ppt-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileBase64,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not extract notes from this presentation.');
      }

      setPptNotes(data as PptNotesData);
    } catch (err) {
      setNotesError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while extracting notes from your presentation.',
      );
    } finally {
      setIsExtractingNotes(false);
    }
  };

  const handleResetAllData = () => {
    runIdRef.current += 1;
    resetPreferences();
    setActiveSource('custom');
    setStory('');
    setSceneCount(6);
    setDrawingStyle('Soft crayon doodle');
    setMaxImages(12);
    setStoryViewMode('vertical');
    setAnalysis(null);
    setScenes([]);
    setIsAnalyzing(false);
    setStatusNote({
      type: 'muted',
      text: 'Pick a quick story or paste your own to get started.',
    });
    setPptMindMap(null);
    setPptError(null);
    setIsAnalyzingPpt(false);
    setPptNotes(null);
    setNotesError(null);
    setIsExtractingNotes(false);
    setActivePage('home');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] transition-colors duration-200">
      <TopBar
        activePage={activePage}
        onGoHome={() => setActivePage('home')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {activePage === 'home' && (
        <HomeDashboard
          onSelectPage={(page) => setActivePage(page)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {activePage === 'story-doodles' && (
        <StoryDoodlesPage
          activeSource={activeSource}
          onSelectPreset={handleSelectPreset}
          onSelectCustomTab={handleSelectCustomTab}
          story={story}
          onStoryChange={setStory}
          sceneCount={sceneCount}
          onSceneCountChange={setSceneCount}
          drawingStyle={drawingStyle}
          onDrawingStyleChange={setDrawingStyle}
          maxImages={maxImages}
          onMaxImagesChange={setMaxImages}
          isAnalyzing={isAnalyzing}
          statusNote={statusNote}
          isModalOpen={isModalOpen}
          onOpenModal={() => setIsModalOpen(true)}
          onCloseModal={() => setIsModalOpen(false)}
          onConfirmIllustrate={handleConfirmIllustrate}
          analysis={analysis}
          scenes={scenes}
          activeStyleUsed={activeStyleUsed}
          viewMode={storyViewMode}
          onViewModeChange={setStoryViewMode}
          onRedrawScene={handleRedrawScene}
          onRetryScene={handleRetryScene}
          isExportingPng={isExportingStoryPng}
          onExportPng={handleExportStoryPng}
          onPrint={handlePrint}
          onGoHome={() => setActivePage('home')}
        />
      )}

      {activePage === 'mind-map' && (
        <MindMapPage
          pptMindMap={pptMindMap}
          isAnalyzingPpt={isAnalyzingPpt}
          pptError={pptError}
          onUploadPptFile={handleUploadPptFile}
          onClearError={() => setPptError(null)}
          isExportingPng={isExportingMindMapPng}
          onExportPng={handleExportMindMapPng}
          onPrint={handlePrint}
          onGoHome={() => setActivePage('home')}
        />
      )}

      {activePage === 'ppt-notes' && (
        <NotesFromPptPage
          notesData={pptNotes}
          isExtracting={isExtractingNotes}
          errorMessage={notesError}
          onUploadFile={handleUploadNotesPptFile}
          onClearError={() => setNotesError(null)}
          onGoHome={() => setActivePage('home')}
        />
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppPreferencesProvider>
      <SparkPadShell />
    </AppPreferencesProvider>
  );
}
