import type { DrawingStyle, StoryAnalysis } from '../types';
import { PRESET_SVGS } from './presetSvgs';

export interface PresetStory {
  id: string;
  title: string;
  tagline: string;
  recommendedStyle: DrawingStyle;
  text: string;
  analysis: StoryAnalysis;
  svgs: string[];
}

export const PRESET_STORIES: PresetStory[] = [
  {
    id: 'red-balloon',
    title: 'The Lost Red Balloon',
    tagline: 'Boy, red balloon, duck pond & giraffe',
    recommendedStyle: 'Soft crayon doodle',
    text: 'A little boy in a blue cap bought a bright red balloon at the sunny park. A gentle breeze blew and lifted the red balloon high above the green trees. The boy ran across the grassy hill chasing the floating string. The balloon drifted over a quiet blue pond where a yellow duck watched it pass. At last, the red balloon got tangled gently in the low branch of an apple tree. A friendly giraffe reached up its long neck and handed the balloon back to the smiling boy.',
    svgs: PRESET_SVGS['red-balloon'],
    analysis: {
      story_title: 'The Lost Red Balloon',
      subtitle: 'A breezy afternoon chase through the park ends with a tall helping hand.',
      character_sheet: [
        {
          name: 'Little Boy',
          visual_description: 'Round boy wearing a bright blue cap, mustard sweater, and friendly smile.',
        },
        {
          name: 'Red Balloon',
          visual_description: 'Bright coral-red oval balloon with a soft highlight and curly dark string.',
        },
        {
          name: 'Yellow Duck',
          visual_description: 'Plump buttercup-yellow pond duck with a rounded orange beak.',
        },
        {
          name: 'Friendly Giraffe',
          visual_description: 'Warm golden giraffe with soft brown spots and a long curved neck.',
        },
      ],
      places: ['Sunny Park', 'Grassy Hill', 'Duck Pond', 'Apple Tree'],
      key_moments: [
        'Buying the red balloon',
        'Breeze carries it skyward',
        'Drifting over the duck pond',
        'Giraffe rescues it from the tree',
      ],
      mind_map_caption: 'A gentle breeze, a long chase, and a kind friend.',
      scenes: [
        {
          title: 'The Sunny Park',
          one_line_summary: 'A boy in a blue cap proudly holds his brand-new red balloon in the park.',
          setting: 'Sunny Park',
          mood: 'Cheerful',
          characters: ['Little Boy', 'Red Balloon'],
          action: 'Standing beside a wooden park bench holding the balloon string.',
          image_prompt:
            'Soft crayon doodle of a little boy in a blue cap and mustard sweater holding a bright red balloon beside a wooden park bench under a warm yellow sun.',
        },
        {
          title: 'Carried by the Breeze',
          one_line_summary: 'A sudden gust lifts the red balloon high above the leafy green trees.',
          setting: 'Park Trees',
          mood: 'Surprised',
          characters: ['Little Boy', 'Red Balloon'],
          action: 'Wind swirls lift the balloon upward while the boy reaches toward it.',
          image_prompt:
            'Soft crayon doodle of gentle wind swirls lifting a bright red balloon above round green park trees while a little boy in a blue cap looks up.',
        },
        {
          title: 'Chasing Up the Hill',
          one_line_summary: 'The boy dashes across the grassy hill trying to catch the trailing string.',
          setting: 'Grassy Hill',
          mood: 'Energetic',
          characters: ['Little Boy', 'Red Balloon'],
          action: 'Running across rolling green hills after the drifting red balloon.',
          image_prompt:
            'Soft crayon doodle of a boy in a blue cap and mustard sweater running across soft green hills chasing a red balloon ahead in the sky.',
        },
        {
          title: 'Over the Duck Pond',
          one_line_summary: 'The floating balloon glides over a calm blue pond watched by a yellow duck.',
          setting: 'Duck Pond',
          mood: 'Peaceful',
          characters: ['Red Balloon', 'Yellow Duck'],
          action: 'A yellow duck floats between lily pads gazing up at the red balloon.',
          image_prompt:
            'Soft crayon doodle of a bright red balloon drifting above a calm blue pond where a yellow duck rests near green lily pads.',
        },
        {
          title: 'Tangled in the Apple Tree',
          one_line_summary: 'The balloon settles gently among the low branches of a leafy apple tree.',
          setting: 'Apple Tree',
          mood: 'Hopeful',
          characters: ['Little Boy', 'Red Balloon'],
          action: 'The boy looks up from below as the red balloon rests in the tree.',
          image_prompt:
            'Soft crayon doodle of a red balloon tangled gently in a green apple tree with small red apples while a boy in a blue cap looks up.',
        },
        {
          title: 'A Tall Helping Hand',
          one_line_summary: 'A friendly spotted giraffe stretches its long neck to hand the balloon back.',
          setting: 'Park Meadow',
          mood: 'Warm',
          characters: ['Little Boy', 'Friendly Giraffe', 'Red Balloon'],
          action: 'The giraffe lowers the red balloon string gently into the boy’s hand.',
          image_prompt:
            'Soft crayon doodle of a warm golden spotted giraffe bending down to return a bright red balloon to a smiling boy in a blue cap.',
        },
      ],
    },
  },

  {
    id: 'pip-snail',
    title: "Pip the Snail's Strawberry",
    tagline: 'Tiny green snail, ladybug & dandelion umbrella',
    recommendedStyle: 'Ink & watercolor',
    text: "Pip was a tiny green snail with a round orange spiral shell living in a sunny garden. One morning, Pip spotted a giant bright red strawberry sitting near a wooden fence. Pip slowly crept across two big green leaves to reach the sweet berry. Along the way, a little spotted red ladybug landed on Pip's shell to say hello. Together they arrived at the strawberry just as a soft raincloud floated overhead. Pip and the ladybug sheltered happily under a big yellow dandelion umbrella while eating a slice of strawberry.",
    svgs: PRESET_SVGS['pip-snail'],
    analysis: {
      story_title: "Pip the Snail's Strawberry",
      subtitle: 'A tiny snail and a friendly ladybug share a sweet garden picnic in the rain.',
      character_sheet: [
        {
          name: 'Pip the Snail',
          visual_description: 'Soft sage-green snail with two round eyestalks and a bright orange spiral shell.',
        },
        {
          name: 'Ladybug',
          visual_description: 'Tiny glossy red ladybug with neat black spots.',
        },
      ],
      places: ['Wooden Fence', 'Leafy Path', 'Dandelion Shelter'],
      key_moments: [
        'Spotting the giant strawberry',
        'Crossing two big garden leaves',
        'Meeting the ladybug',
        'Picnic under the dandelion umbrella',
      ],
      mind_map_caption: 'Small travelers find big sweetness together.',
      scenes: [
        {
          title: 'Morning by the Fence',
          one_line_summary: 'Pip wakes up in the sunny garden beside a warm wooden picket fence.',
          setting: 'Garden Fence',
          mood: 'Cozy',
          characters: ['Pip the Snail'],
          action: 'Pip stretches out along the soft morning grass.',
          image_prompt:
            'Ink and watercolor doodle of a tiny green snail with an orange spiral shell beside a wooden garden fence.',
        },
        {
          title: 'The Giant Red Berry',
          one_line_summary: 'Pip spots an enormous bright red strawberry resting near the fence.',
          setting: 'Sunny Patch',
          mood: 'Curious',
          characters: ['Pip the Snail'],
          action: 'Pip gazes across the grass at the giant strawberry.',
          image_prompt:
            'Ink and watercolor doodle of Pip the green snail gazing at a giant bright red strawberry near a wooden fence.',
        },
        {
          title: 'Across the Big Leaves',
          one_line_summary: 'Pip glides steadily over two broad green garden leaves toward the treat.',
          setting: 'Leafy Path',
          mood: 'Determined',
          characters: ['Pip the Snail'],
          action: 'Creeping smoothly across overlapping green leaves.',
          image_prompt:
            'Ink and watercolor doodle of a tiny green snail with an orange spiral shell crawling across two big green garden leaves.',
        },
        {
          title: 'A Spotted Hello',
          one_line_summary: 'A cheerful red ladybug lands gently atop Pip’s orange spiral shell.',
          setting: 'Garden Trail',
          mood: 'Friendly',
          characters: ['Pip the Snail', 'Ladybug'],
          action: 'The ladybug rides happily on Pip’s shell.',
          image_prompt:
            'Ink and watercolor doodle of a tiny spotted red ladybug perched cheerfully on top of Pip the snail’s orange spiral shell.',
        },
        {
          title: 'Soft Garden Rain',
          one_line_summary: 'A gentle pastel raincloud drifts overhead as they reach the strawberry.',
          setting: 'Berry Patch',
          mood: 'Gentle',
          characters: ['Pip the Snail', 'Ladybug'],
          action: 'Soft raindrops fall as Pip and the ladybug arrive at the strawberry.',
          image_prompt:
            'Ink and watercolor doodle of a soft blue raincloud sprinkling gentle raindrops over Pip the snail, a ladybug, and a giant strawberry.',
        },
        {
          title: 'Dandelion Umbrella Picnic',
          one_line_summary: 'Pip and the ladybug stay dry beneath a yellow dandelion while sharing strawberry.',
          setting: 'Dandelion Shelter',
          mood: 'Delighted',
          characters: ['Pip the Snail', 'Ladybug'],
          action: 'Sharing a sweet red strawberry slice under a golden dandelion bloom.',
          image_prompt:
            'Ink and watercolor doodle of Pip the snail and a spotted ladybug sheltering under a big yellow dandelion flower while eating a slice of strawberry.',
        },
      ],
    },
  },

  {
    id: 'sunny-snowman',
    title: "Sunny the Snowman's Scarf",
    tagline: 'Snowman, playful rabbit & winter pine hill',
    recommendedStyle: 'Soft crayon doodle',
    text: "A girl in a purple coat rolled three round white snowballs in her front yard to build a snowman. She gave Sunny two black button eyes, a bright orange carrot nose, and a cozy green striped scarf. That afternoon, a playful white rabbit hopped out from behind a pine tree. The rabbit tugged on Sunny's green scarf and bounced away across the snowy hill. The girl and the rabbit played tag around the pine trees under a pale blue winter sky. When the golden moon came up, the rabbit tucked the green scarf neatly back around Sunny's neck before going to sleep.",
    svgs: PRESET_SVGS['sunny-snowman'],
    analysis: {
      story_title: "Sunny the Snowman's Scarf",
      subtitle: 'A snowy backyard game of tag ends with a cozy bedtime tuck-in.',
      character_sheet: [
        {
          name: 'Girl',
          visual_description: 'Cheerful girl in a lavender-purple winter coat and orange pom-pom hat.',
        },
        {
          name: 'Sunny the Snowman',
          visual_description: 'Three stacked white snowballs with button eyes, orange carrot nose, and green striped scarf.',
        },
        {
          name: 'White Rabbit',
          visual_description: 'Fluffy cream-white rabbit with tall rounded ears and pink cheeks.',
        },
      ],
      places: ['Front Yard', 'Pine Tree', 'Snowy Hill'],
      key_moments: [
        'Rolling three snowballs',
        'Giving Sunny his green scarf',
        'Rabbit borrows the scarf',
        'Moonlit scarf return',
      ],
      mind_map_caption: 'Winter games always wrap up warmly.',
      scenes: [
        {
          title: 'Three Round Snowballs',
          one_line_summary: 'A girl in a purple coat stacks three fluffy snowballs in her snowy yard.',
          setting: 'Front Yard',
          mood: 'Playful',
          characters: ['Girl'],
          action: 'Rolling and stacking three white snowballs in the snow.',
          image_prompt:
            'Soft crayon doodle of a girl in a purple coat and orange hat stacking three white snowballs in a snowy yard.',
        },
        {
          title: 'Dressing Sunny',
          one_line_summary: 'Sunny gets button eyes, a bright carrot nose, and a cozy green striped scarf.',
          setting: 'Front Yard',
          mood: 'Cozy',
          characters: ['Sunny the Snowman'],
          action: 'Sunny stands smiling in his fresh green striped scarf.',
          image_prompt:
            'Soft crayon doodle of a smiling snowman with black button eyes, orange carrot nose, and a cozy green striped scarf.',
        },
        {
          title: 'Peekaboo by the Pine',
          one_line_summary: 'A curious white rabbit peeks out from behind a snow-dusted pine tree.',
          setting: 'Pine Tree',
          mood: 'Curious',
          characters: ['White Rabbit'],
          action: 'Peeking playfully around a green pine trunk.',
          image_prompt:
            'Soft crayon doodle of a fluffy white rabbit peeking out from behind a green winter pine tree in the snow.',
        },
        {
          title: 'The Scarf Dash',
          one_line_summary: 'The playful rabbit tugs Sunny’s green scarf and hops across the snowy hill.',
          setting: 'Snowy Hill',
          mood: 'Mischievous',
          characters: ['Sunny the Snowman', 'White Rabbit'],
          action: 'Hopping across the hill trailing the green striped scarf.',
          image_prompt:
            'Soft crayon doodle of a white rabbit bouncing across a snowy hill with a green striped scarf while Sunny the snowman watches.',
        },
        {
          title: 'Winter Tag',
          one_line_summary: 'The girl and the rabbit race around the pine trees under a crisp blue sky.',
          setting: 'Pine Woods',
          mood: 'Joyful',
          characters: ['Girl', 'White Rabbit'],
          action: 'Laughing and playing tag around a snowy pine tree.',
          image_prompt:
            'Soft crayon doodle of a girl in a purple coat playing tag with a white rabbit around pine trees in the snow.',
        },
        {
          title: 'Moonlit Tuck-In',
          one_line_summary: 'Under a golden crescent moon, the rabbit neatly wraps the scarf back around Sunny.',
          setting: 'Front Yard',
          mood: 'Peaceful',
          characters: ['Sunny the Snowman', 'White Rabbit'],
          action: 'Tucking the green scarf gently back around Sunny’s neck.',
          image_prompt:
            'Soft crayon doodle under a golden crescent moon where a white rabbit tucks a green striped scarf back around a smiling snowman.',
        },
      ],
    },
  },

  {
    id: 'paper-boat',
    title: 'The Paper Boat Harbor',
    tagline: 'Yellow paper boat, puddle race & frog captain',
    recommendedStyle: 'Pencil sketch',
    text: 'On a rainy morning, Mia folded a bright yellow newspaper into a little paper boat and put on her red raincoat. Her tiny brown dog Pip trotted beside her with a blue scarf around his neck. When Mia placed the boat in a garden puddle, a breeze pushed it down a winding cobblestone stream. Mia and Pip hopped over puddles along the lane to keep the yellow boat in sight. The stream emptied into a calm park pond filled with round green lily pads. A little green frog hopped right onto the paper boat like a captain while Mia cheered from the wooden bridge.',
    svgs: PRESET_SVGS['paper-boat'],
    analysis: {
      story_title: 'The Paper Boat Harbor',
      subtitle: 'A rainy-day paper boat voyage leads to a surprise captain on the pond.',
      character_sheet: [
        {
          name: 'Mia',
          visual_description: 'Young girl in a hooded red raincoat.',
        },
        {
          name: 'Pip the Dog',
          visual_description: 'Small brown terrier dog wearing a sky-blue neck scarf.',
        },
        {
          name: 'Green Frog',
          visual_description: 'Cheerful round sage-green frog.',
        },
      ],
      places: ['Backyard Puddle', 'Cobblestone Lane', 'Park Pond', 'Wooden Bridge'],
      key_moments: [
        'Folding the yellow boat',
        'Launching into the puddle',
        'Racing down the cobblestone stream',
        'Frog hops aboard as captain',
      ],
      mind_map_caption: 'Even a rainy morning carries its own little voyage.',
      scenes: [
        {
          title: 'Folding the Fleet',
          one_line_summary: 'Mia folds a bright yellow paper boat in her red raincoat while Pip watches.',
          setting: 'Porch Step',
          mood: 'Cozy',
          characters: ['Mia', 'Pip the Dog'],
          action: 'Holding the crisp yellow folded paper boat.',
          image_prompt:
            'Pencil sketch with pastel wash of Mia in a red raincoat holding a yellow paper boat beside her brown terrier Pip in a blue scarf.',
        },
        {
          title: 'Garden Puddle Launch',
          one_line_summary: 'Mia places the yellow boat gently onto a shimmering rainwater puddle.',
          setting: 'Garden Puddle',
          mood: 'Excited',
          characters: ['Mia'],
          action: 'Kneeling beside a blue puddle as the boat begins to float.',
          image_prompt:
            'Pencil sketch of Mia in a red raincoat launching a yellow paper boat onto a garden puddle in soft rain.',
        },
        {
          title: 'Down the Cobble Stream',
          one_line_summary: 'A fresh breeze nudges the yellow paper boat along a winding stone gutter.',
          setting: 'Cobblestone Lane',
          mood: 'Adventurous',
          characters: [],
          action: 'The yellow paper boat bobs swiftly along the curving stream.',
          image_prompt:
            'Pencil sketch of a yellow paper boat sailing down a winding cobblestone gutter stream.',
        },
        {
          title: 'The Puddle Race',
          one_line_summary: 'Mia and Pip dash along the wet lane keeping pace with the sailing boat.',
          setting: 'Rainy Lane',
          mood: 'Lively',
          characters: ['Mia', 'Pip the Dog'],
          action: 'Running side by side along the lane beside the drifting yellow boat.',
          image_prompt:
            'Pencil sketch of Mia in a red raincoat and her brown terrier Pip in a blue scarf running beside a yellow paper boat in a street stream.',
        },
        {
          title: 'Lily Pad Harbor',
          one_line_summary: 'The stream opens into a quiet blue park pond dotted with green lily pads.',
          setting: 'Park Pond',
          mood: 'Calm',
          characters: [],
          action: 'The yellow paper boat glides peacefully among round lily pads.',
          image_prompt:
            'Pencil sketch of a yellow paper boat drifting calmly into a park pond dotted with green lily pads.',
        },
        {
          title: 'Captain Frog',
          one_line_summary: 'A green frog hops aboard as captain while Mia cheers from the wooden bridge.',
          setting: 'Wooden Bridge',
          mood: 'Delighted',
          characters: ['Mia', 'Green Frog'],
          action: 'The frog sits proudly on the boat as Mia waves from the bridge.',
          image_prompt:
            'Pencil sketch of a round green frog perched on a yellow paper boat while Mia in a red raincoat waves from a curved wooden bridge.',
        },
      ],
    },
  },

  {
    id: 'little-blue-robot',
    title: 'The Little Blue Robot',
    tagline: 'Round blue robot, yellow bird & window sunflower',
    recommendedStyle: 'Comic doodle',
    text: 'A round little blue robot with glowing yellow eyes lived inside a cozy workshop with a small arched window. Every morning, he watered a bright yellow sunflower growing in a clay pot on his windowsill. One day, a tiny orange songbird tapped gently on the glass during a gusty wind. The blue robot opened the window and held out a warm teacup for the shivering bird to rest beside. While the wind blew outside, the bird sang cheerful notes that made the robot’s antenna glow softly. When the sun came back out, the bird perched on the sunflower and waved goodbye with its wing.',
    svgs: PRESET_SVGS['little-blue-robot'],
    analysis: {
      story_title: 'The Little Blue Robot',
      subtitle: 'A gentle workshop robot welcomes a storm-tossed songbird inside for tea.',
      character_sheet: [
        {
          name: 'Blue Robot',
          visual_description: 'Round powder-blue robot with a domed head, glowing yellow eyes, and bulb antenna.',
        },
        {
          name: 'Orange Songbird',
          visual_description: 'Plump tangerine-orange bird with a small golden beak.',
        },
      ],
      places: ['Cozy Workshop', 'Arched Window', 'Sunny Sill'],
      key_moments: [
        'Watering the window sunflower',
        'Bird taps during the wind',
        'Warm teacup shelter',
        'Sunny wave goodbye',
      ],
      mind_map_caption: 'Warm kindness makes even metal hearts glow.',
      scenes: [
        {
          title: 'The Arched Workshop',
          one_line_summary: 'A round blue robot with bright yellow eyes tends his cozy arched-window room.',
          setting: 'Cozy Workshop',
          mood: 'Warm',
          characters: ['Blue Robot'],
          action: 'Smiling beside a sunlit arched workshop window.',
          image_prompt:
            'Comic doodle of a round little blue robot with glowing yellow eyes standing beside an arched workshop window.',
        },
        {
          title: 'Morning Sunflower',
          one_line_summary: 'Every morning he pours cool water over his sunny windowsill flower.',
          setting: 'Windowsill',
          mood: 'Gentle',
          characters: ['Blue Robot'],
          action: 'Tipping a pastel watering can above a bright yellow sunflower.',
          image_prompt:
            'Comic doodle of a round blue robot watering a bright yellow sunflower in a terracotta pot.',
        },
        {
          title: 'A Tap on the Glass',
          one_line_summary: 'During a gusty wind, a tiny orange songbird taps against the windowpane.',
          setting: 'Arched Window',
          mood: 'Curious',
          characters: ['Blue Robot', 'Orange Songbird'],
          action: 'The blue robot peers out as the orange bird taps on the glass.',
          image_prompt:
            'Comic doodle of a tiny orange songbird tapping on a windy windowpane while a round blue robot peeks from inside.',
        },
        {
          title: 'A Warm Teacup',
          one_line_summary: 'The robot invites the shivering bird inside and offers a steaming teacup.',
          setting: 'Workshop Table',
          mood: 'Kind',
          characters: ['Blue Robot', 'Orange Songbird'],
          action: 'Holding out a steaming cream teacup for the tiny bird.',
          image_prompt:
            'Comic doodle of a round blue robot offering a warm steaming teacup to a tiny orange songbird.',
        },
        {
          title: 'The Glowing Song',
          one_line_summary: 'Cheerful bird notes drift through the room, making the robot’s antenna glow.',
          setting: 'Cozy Workshop',
          mood: 'Musical',
          characters: ['Blue Robot', 'Orange Songbird'],
          action: 'The songbird chirps music notes while the robot’s antenna shines warmly.',
          image_prompt:
            'Comic doodle of an orange songbird singing musical notes while the blue robot’s bulb antenna glows softly yellow.',
        },
        {
          title: 'Sunny Goodbye',
          one_line_summary: 'When sunshine returns, the songbird perches on the sunflower and waves goodbye.',
          setting: 'Sunny Sill',
          mood: 'Happy',
          characters: ['Blue Robot', 'Orange Songbird'],
          action: 'The bird waves from atop the sunflower as the robot waves back.',
          image_prompt:
            'Comic doodle of an orange songbird perched on a yellow sunflower waving goodbye to a smiling round blue robot in the sunshine.',
        },
      ],
    },
  },
];
