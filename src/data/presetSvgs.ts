// Hand-crafted, self-contained inline SVGs (viewBox="0 0 250 180", preserveAspectRatio="xMidYMid slice")
// for the 5 preloaded stories so clicking any preset renders instantly with zero AI wait time.

export const PRESET_SVGS: Record<string, string[]> = {
  'red-balloon': [
    // 1. Sunny park + boy in blue cap + red balloon
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef6fb"/>
      <circle cx="206" cy="36" r="18" fill="#fae08c" stroke="#3b3830" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 32 42 Q 44 28 60 36 Q 74 28 84 42 Q 90 50 78 52 L 36 52 Q 24 50 32 42 Z" fill="#fffefa" stroke="#3b3830" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 0 132 Q 70 112 145 128 T 250 124 L 250 180 L 0 180 Z" fill="#cde3be" stroke="#3b3830" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="148" y="114" width="64" height="10" rx="4" fill="#d9b48f" stroke="#3b3830" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="158" y1="124" x2="158" y2="142" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="202" y1="124" x2="202" y2="142" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Boy -->
      <path d="M 88 106 Q 88 94 100 94 Q 112 94 112 106 L 114 134 L 86 134 Z" fill="#e8b86d" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="94" y1="134" x2="94" y2="154" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <line x1="106" y1="134" x2="106" y2="154" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <path d="M 112 108 L 130 98" fill="none" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="79" r="14" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 86 76 Q 100 60 114 76 Z" fill="#5b84b1" stroke="#3b3830" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 110 76 L 122 76" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="96" cy="80" r="1.6" fill="#3b3830"/>
      <circle cx="105" cy="80" r="1.6" fill="#3b3830"/>
      <path d="M 96 86 Q 100 90 105 86" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <!-- Red Balloon -->
      <path d="M 130 98 Q 124 78 136 60" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="137" cy="42" rx="16" ry="20" fill="#e3655b" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 131 32 Q 134 26 139 27" fill="none" stroke="#f7b6b0" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    // 2. Breeze lifts balloon above green trees
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e6f2f8"/>
      <!-- Wind swirls -->
      <path d="M 28 52 Q 68 42 104 54 Q 116 58 110 66 Q 104 72 96 66" fill="none" stroke="#8fb3c9" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M 44 76 Q 82 68 122 76" fill="none" stroke="#8fb3c9" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Green Trees -->
      <path d="M 0 144 Q 65 130 135 140 T 250 136 L 250 180 L 0 180 Z" fill="#c5deb3" stroke="#3b3830" stroke-width="2.5"/>
      <rect x="40" y="106" width="12" height="40" rx="4" fill="#b58d67" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="46" cy="92" r="24" fill="#9bc28c" stroke="#3b3830" stroke-width="2.5"/>
      <rect x="176" y="104" width="14" height="42" rx="4" fill="#b58d67" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="183" cy="88" r="28" fill="#8bb87b" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Boy looking up -->
      <path d="M 102 124 Q 102 114 112 114 Q 122 114 122 124 L 123 148 L 101 148 Z" fill="#e8b86d" stroke="#3b3830" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="107" y1="148" x2="107" y2="164" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="117" y1="148" x2="117" y2="164" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M 122 122 L 136 108" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="112" cy="100" r="12" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 100 96 Q 112 82 124 96 Z" fill="#5b84b1" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="116" cy="99" r="1.5" fill="#3b3830"/>
      <!-- High Red Balloon -->
      <path d="M 164 58 Q 158 76 168 92" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="164" cy="38" rx="15" ry="19" fill="#e3655b" stroke="#3b3830" stroke-width="2.6"/>
      <path d="M 158 29 Q 161 24 166 25" fill="none" stroke="#f7b6b0" stroke-width="2.3" stroke-linecap="round"/>
    </svg>`,
    // 3. Running across grassy hill
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f3f8fc"/>
      <path d="M 18 38 Q 30 26 44 34 Q 56 26 66 38 Z" fill="#fffefa" stroke="#3b3830" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 0 118 Q 76 82 162 122 T 250 108 L 250 180 L 0 180 Z" fill="#b7d6a5" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 0 144 Q 110 124 250 148 L 250 180 L 0 180 Z" fill="#cde3be" stroke="#3b3830" stroke-width="2.2"/>
      <!-- Running Boy -->
      <path d="M 76 102 Q 82 90 94 94 L 90 122 L 70 118 Z" fill="#e8b86d" stroke="#3b3830" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M 74 119 L 60 134" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <path d="M 86 121 L 102 134" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <path d="M 94 100 L 114 88" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <circle cx="88" cy="79" r="13" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.6"/>
      <path d="M 75 76 Q 88 61 101 76 Z" fill="#5b84b1" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 98 76 L 110 75" stroke="#3b3830" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="93" cy="79" r="1.5" fill="#3b3830"/>
      <!-- Balloon drifting ahead -->
      <path d="M 192 54 Q 182 72 190 88" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="195" cy="36" rx="15" ry="19" fill="#e3655b" stroke="#3b3830" stroke-width="2.6"/>
      <path d="M 189 27 Q 192 22 197 23" fill="none" stroke="#f7b6b0" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    // 4. Over the duck pond
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef5fa"/>
      <path d="M 0 104 Q 125 94 250 104 L 250 180 L 0 180 Z" fill="#cbe0bc" stroke="#3b3830" stroke-width="2.4"/>
      <ellipse cx="128" cy="140" rx="92" ry="28" fill="#9bc7e0" stroke="#3b3830" stroke-width="2.6"/>
      <ellipse cx="82" cy="146" rx="15" ry="6" fill="#89ba7b" stroke="#3b3830" stroke-width="2"/>
      <ellipse cx="182" cy="134" rx="13" ry="5" fill="#89ba7b" stroke="#3b3830" stroke-width="2"/>
      <!-- Yellow Duck -->
      <ellipse cx="132" cy="134" rx="17" ry="11" fill="#f4d35e" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="143" cy="121" r="9" fill="#f4d35e" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 151 120 L 160 122 L 151 125 Z" fill="#e88d3a" stroke="#3b3830" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="146" cy="119" r="1.5" fill="#3b3830"/>
      <!-- Balloon overhead -->
      <path d="M 118 58 Q 112 74 120 90" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="120" cy="39" rx="15" ry="19" fill="#e3655b" stroke="#3b3830" stroke-width="2.6"/>
      <path d="M 114 30 Q 117 25 122 26" fill="none" stroke="#f7b6b0" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    // 5. Tangled in apple tree
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f2f6ee"/>
      <path d="M 0 142 Q 125 130 250 142 L 250 180 L 0 180 Z" fill="#c7deb7" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Apple Tree -->
      <path d="M 154 90 L 154 148 L 172 148 L 172 90 Z" fill="#b58d67" stroke="#3b3830" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="144" cy="70" r="30" fill="#8cb87c" stroke="#3b3830" stroke-width="2.6"/>
      <circle cx="182" cy="68" r="28" fill="#9bc58a" stroke="#3b3830" stroke-width="2.6"/>
      <circle cx="164" cy="46" r="26" fill="#8cb87c" stroke="#3b3830" stroke-width="2.6"/>
      <circle cx="142" cy="64" r="5" fill="#e06055" stroke="#3b3830" stroke-width="2"/>
      <circle cx="186" cy="74" r="5" fill="#e06055" stroke="#3b3830" stroke-width="2"/>
      <!-- Tangled Red Balloon -->
      <path d="M 122 66 Q 130 78 136 86" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="118" cy="48" rx="14" ry="18" fill="#e3655b" stroke="#3b3830" stroke-width="2.6"/>
      <!-- Boy looking up -->
      <path d="M 60 118 Q 60 108 70 108 Q 80 108 80 118 L 81 142 L 59 142 Z" fill="#e8b86d" stroke="#3b3830" stroke-width="2.5"/>
      <line x1="65" y1="142" x2="65" y2="156" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="75" y1="142" x2="75" y2="156" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="70" cy="95" r="12" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 58 92 Q 70 78 82 92 Z" fill="#5b84b1" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="74" cy="95" r="1.5" fill="#3b3830"/>
    </svg>`,
    // 6. Friendly giraffe returns the balloon
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f9f4e4"/>
      <circle cx="44" cy="36" r="16" fill="#fae08c" stroke="#3b3830" stroke-width="2.4"/>
      <path d="M 0 140 Q 125 130 250 140 L 250 180 L 0 180 Z" fill="#cde3be" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Friendly Giraffe -->
      <path d="M 156 146 L 156 112 Q 156 102 174 102 Q 192 102 192 114 L 192 146" fill="#f2c572" stroke="#3b3830" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M 158 108 L 142 54 L 156 50 L 172 104" fill="#f2c572" stroke="#3b3830" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="144" cy="48" rx="14" ry="10" fill="#f2c572" stroke="#3b3830" stroke-width="2.6"/>
      <line x1="146" y1="38" x2="148" y2="30" stroke="#3b3830" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="148" cy="29" r="2.5" fill="#c88a4b" stroke="#3b3830" stroke-width="1.8"/>
      <circle cx="140" cy="46" r="1.6" fill="#3b3830"/>
      <circle cx="158" cy="82" r="4" fill="#c88a4b"/>
      <circle cx="176" cy="118" r="5" fill="#c88a4b"/>
      <!-- Balloon handed down -->
      <path d="M 130 48 Q 120 74 114 108" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="114" cy="42" rx="14" ry="18" fill="#e3655b" stroke="#3b3830" stroke-width="2.6"/>
      <!-- Happy Boy -->
      <path d="M 80 118 Q 80 107 90 107 Q 100 107 100 118 L 101 142 L 79 142 Z" fill="#e8b86d" stroke="#3b3830" stroke-width="2.5"/>
      <line x1="85" y1="142" x2="85" y2="156" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="95" y1="142" x2="95" y2="156" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M 100 116 L 114 108" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="90" cy="94" r="12" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 78 91 Q 90 77 102 91 Z" fill="#5b84b1" stroke="#3b3830" stroke-width="2.4"/>
      <path d="M 86 99 Q 90 103 95 99" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  ],

  'pip-snail': [
    // 1. Pip by garden fence
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f2f6ea"/>
      <circle cx="46" cy="36" r="16" fill="#fae293" stroke="#2c2a25" stroke-width="2.2"/>
      <!-- Fence -->
      <rect x="20" y="74" width="24" height="66" rx="3" fill="#e3cfb4" stroke="#2c2a25" stroke-width="2.3"/>
      <rect x="54" y="74" width="24" height="66" rx="3" fill="#e3cfb4" stroke="#2c2a25" stroke-width="2.3"/>
      <rect x="88" y="74" width="24" height="66" rx="3" fill="#e3cfb4" stroke="#2c2a25" stroke-width="2.3"/>
      <rect x="12" y="96" width="112" height="10" rx="3" fill="#d6be9c" stroke="#2c2a25" stroke-width="2.2"/>
      <path d="M 0 136 Q 125 126 250 136 L 250 180 L 0 180 Z" fill="#c8dfb9" stroke="#2c2a25" stroke-width="2.4"/>
      <!-- Pip the Snail -->
      <path d="M 122 142 Q 160 144 176 136 Q 182 126 170 122 Q 158 124 152 134 L 122 134 Q 114 138 122 142 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="140" cy="120" r="18" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.5"/>
      <path d="M 140 120 C 145 116 148 124 140 126 C 132 126 130 114 140 112 C 150 112 152 124 147 130" fill="none" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <line x1="170" y1="122" x2="174" y2="112" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <line x1="175" y1="123" x2="181" y2="114" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <circle cx="174" cy="111" r="2.2" fill="#2c2a25"/>
      <circle cx="181" cy="113" r="2.2" fill="#2c2a25"/>
    </svg>`,
    // 2. Spotting the giant red strawberry
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f7f4e8"/>
      <rect x="166" y="72" width="22" height="66" rx="3" fill="#e3cfb4" stroke="#2c2a25" stroke-width="2.2"/>
      <rect x="198" y="72" width="22" height="66" rx="3" fill="#e3cfb4" stroke="#2c2a25" stroke-width="2.2"/>
      <path d="M 0 134 Q 125 126 250 134 L 250 180 L 0 180 Z" fill="#c8dfb9" stroke="#2c2a25" stroke-width="2.4"/>
      <!-- Giant Strawberry -->
      <path d="M 152 92 Q 180 86 184 114 Q 184 140 162 146 Q 140 140 140 114 Q 142 94 152 92 Z" fill="#e35d5b" stroke="#2c2a25" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M 146 92 L 154 82 L 162 90 L 170 82 L 178 92 Z" fill="#6b9e63" stroke="#2c2a25" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="154" cy="110" r="1.5" fill="#f7d070"/>
      <circle cx="168" cy="112" r="1.5" fill="#f7d070"/>
      <circle cx="160" cy="124" r="1.5" fill="#f7d070"/>
      <circle cx="153" cy="133" r="1.5" fill="#f7d070"/>
      <!-- Pip looking amazed -->
      <path d="M 54 144 Q 90 146 106 138 Q 112 128 100 124 Q 88 126 82 136 L 54 136 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="72" cy="122" r="17" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.4"/>
      <path d="M 72 122 C 76 118 79 125 72 127 C 65 127 64 116 72 114" fill="none" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <line x1="100" y1="124" x2="104" y2="114" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <circle cx="104" cy="113" r="2.2" fill="#2c2a25"/>
    </svg>`,
    // 3. Creeping across two big green leaves
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef5eb"/>
      <path d="M 0 146 Q 125 138 250 146 L 250 180 L 0 180 Z" fill="#d9e8cb"/>
      <!-- Two Big Leaves -->
      <path d="M 24 134 Q 70 98 134 126 Q 94 156 24 134 Z" fill="#9bc58a" stroke="#2c2a25" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 110 132 Q 168 102 228 130 Q 176 160 110 132 Z" fill="#84b374" stroke="#2c2a25" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Pip on the leaves -->
      <path d="M 88 122 Q 124 124 140 116 Q 146 106 134 102 Q 122 104 116 114 L 88 114 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="105" cy="100" r="17" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.4"/>
      <path d="M 105 100 C 109 96 112 103 105 105 C 98 105 97 94 105 92" fill="none" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <line x1="134" y1="102" x2="138" y2="92" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <circle cx="138" cy="91" r="2.2" fill="#2c2a25"/>
    </svg>`,
    // 4. Spotted red ladybug lands on Pip's shell
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f9f3ea"/>
      <path d="M 0 136 Q 125 126 250 136 L 250 180 L 0 180 Z" fill="#c8dfb9" stroke="#2c2a25" stroke-width="2.4"/>
      <!-- Pip -->
      <path d="M 84 140 Q 130 142 152 132 Q 160 120 146 115 Q 132 117 124 128 L 84 128 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="108" cy="112" r="22" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.6"/>
      <path d="M 108 112 C 114 107 117 117 108 119 C 98 119 96 104 108 102" fill="none" stroke="#2c2a25" stroke-width="2" stroke-linecap="round"/>
      <line x1="146" y1="115" x2="152" y2="103" stroke="#2c2a25" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="152" cy="102" r="2.4" fill="#2c2a25"/>
      <!-- Ladybug on Shell -->
      <path d="M 98 89 A 10 10 0 0 1 118 89 Z" fill="#d9534f" stroke="#2c2a25" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="116" cy="86" r="4" fill="#2c2a25"/>
      <circle cx="104" cy="84" r="1.8" fill="#2c2a25"/>
      <circle cx="110" cy="82" r="1.8" fill="#2c2a25"/>
    </svg>`,
    // 5. Soft raincloud overhead
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e4edf4"/>
      <!-- Soft Raincloud -->
      <path d="M 68 46 Q 82 28 104 34 Q 124 22 146 36 Q 168 34 174 52 Q 178 64 162 64 L 74 64 Q 58 62 68 46 Z" fill="#c7d8e8" stroke="#2c2a25" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="86" y1="74" x2="82" y2="86" stroke="#7aa5c9" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="114" y1="76" x2="110" y2="88" stroke="#7aa5c9" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="142" y1="74" x2="138" y2="86" stroke="#7aa5c9" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M 0 136 Q 125 126 250 136 L 250 180 L 0 180 Z" fill="#b7d2ac" stroke="#2c2a25" stroke-width="2.4"/>
      <!-- Strawberry -->
      <path d="M 168 104 Q 190 100 192 122 Q 192 142 174 146 Q 156 142 156 122 Q 158 106 168 104 Z" fill="#e35d5b" stroke="#2c2a25" stroke-width="2.4"/>
      <path d="M 162 104 L 174 96 L 186 104 Z" fill="#6b9e63" stroke="#2c2a25" stroke-width="2"/>
      <!-- Pip & Ladybug -->
      <path d="M 62 140 Q 98 142 114 134 Q 120 124 108 120 Q 96 122 90 132 L 62 132 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.4"/>
      <circle cx="80" cy="118" r="17" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.4"/>
      <path d="M 73 101 A 7 7 0 0 1 87 101 Z" fill="#d9534f" stroke="#2c2a25" stroke-width="2"/>
    </svg>`,
    // 6. Sheltering under dandelion umbrella with strawberry slice
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef4ea"/>
      <line x1="42" y1="24" x2="38" y2="36" stroke="#8ab0d1" stroke-width="2" stroke-linecap="round"/>
      <line x1="204" y1="28" x2="200" y2="40" stroke="#8ab0d1" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0 138 Q 125 130 250 138 L 250 180 L 0 180 Z" fill="#c5deb7" stroke="#2c2a25" stroke-width="2.4"/>
      <!-- Dandelion Umbrella -->
      <path d="M 124 140 Q 120 100 124 62" fill="none" stroke="#6b9e63" stroke-width="4" stroke-linecap="round"/>
      <path d="M 62 72 Q 124 24 188 72 Q 154 66 124 72 Q 94 66 62 72 Z" fill="#f7d65a" stroke="#2c2a25" stroke-width="2.6" stroke-linejoin="round"/>
      <!-- Pip & Ladybug eating strawberry slice -->
      <path d="M 72 140 Q 106 142 120 134 Q 124 126 114 122 L 72 132 Z" fill="#8ab87a" stroke="#2c2a25" stroke-width="2.4"/>
      <circle cx="88" cy="120" r="16" fill="#e89c5e" stroke="#2c2a25" stroke-width="2.4"/>
      <path d="M 130 138 L 148 122 L 154 140 Z" fill="#e35d5b" stroke="#2c2a25" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 156 138 A 9 9 0 0 1 174 138 Z" fill="#d9534f" stroke="#2c2a25" stroke-width="2.2"/>
      <circle cx="163" cy="133" r="1.5" fill="#2c2a25"/>
      <circle cx="168" cy="134" r="1.5" fill="#2c2a25"/>
    </svg>`,
  ],

  'sunny-snowman': [
    // 1. Girl in purple coat rolling three snowballs
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e3eff7"/>
      <path d="M 0 126 Q 125 112 250 126 L 250 180 L 0 180 Z" fill="#fbfaf6" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Three Snowballs -->
      <circle cx="158" cy="128" r="22" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="158" cy="96" r="16" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="158" cy="70" r="12" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Girl in Purple Coat -->
      <path d="M 74 114 Q 76 98 90 98 Q 104 98 106 114 L 110 142 L 70 142 Z" fill="#8d7bb8" stroke="#3b3830" stroke-width="2.6" stroke-linejoin="round"/>
      <line x1="82" y1="142" x2="82" y2="156" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <line x1="98" y1="142" x2="98" y2="156" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <path d="M 105 112 L 138 100" stroke="#3b3830" stroke-width="3" stroke-linecap="round"/>
      <circle cx="90" cy="82" r="13" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 77 78 Q 90 60 103 78 Z" fill="#e89c5e" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="90" cy="63" r="4" fill="#fffefa" stroke="#3b3830" stroke-width="2"/>
      <circle cx="94" cy="82" r="1.5" fill="#3b3830"/>
    </svg>`,
    // 2. Sunny with button eyes, carrot nose & green striped scarf
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e8f2f8"/>
      <path d="M 0 132 Q 125 120 250 132 L 250 180 L 0 180 Z" fill="#fbfaf6" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Sunny Snowman -->
      <circle cx="128" cy="130" r="24" fill="#fffefa" stroke="#3b3830" stroke-width="2.6"/>
      <circle cx="128" cy="96" r="18" fill="#fffefa" stroke="#3b3830" stroke-width="2.6"/>
      <circle cx="128" cy="66" r="14" fill="#fffefa" stroke="#3b3830" stroke-width="2.6"/>
      <!-- Eyes, Carrot Nose & Smile -->
      <circle cx="123" cy="62" r="2.2" fill="#292a24"/>
      <circle cx="133" cy="62" r="2.2" fill="#292a24"/>
      <path d="M 128 66 L 143 68 L 128 71 Z" fill="#e8823a" stroke="#3b3830" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 122 73 Q 128 77 134 73" fill="none" stroke="#3b3830" stroke-width="2" stroke-linecap="round"/>
      <!-- Green Striped Scarf -->
      <rect x="112" y="77" width="32" height="9" rx="4" fill="#5b8c5a" stroke="#3b3830" stroke-width="2.4"/>
      <path d="M 134 84 L 142 108 L 130 110 L 126 86 Z" fill="#5b8c5a" stroke="#3b3830" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="120" y1="78" x2="120" y2="85" stroke="#cde3be" stroke-width="2.2"/>
      <line x1="130" y1="78" x2="130" y2="85" stroke="#cde3be" stroke-width="2.2"/>
    </svg>`,
    // 3. White rabbit peeking behind pine tree
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e3eff7"/>
      <path d="M 0 132 Q 125 120 250 132 L 250 180 L 0 180 Z" fill="#fbfaf6" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Pine Tree -->
      <rect x="108" y="120" width="14" height="22" fill="#9c7a58" stroke="#3b3830" stroke-width="2.4"/>
      <polygon points="115,38 78,90 152,90" fill="#6e996f" stroke="#3b3830" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="115,64 70,122 160,122" fill="#5b8c5a" stroke="#3b3830" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- White Rabbit Peeking -->
      <ellipse cx="164" cy="102" rx="4" ry="13" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.3"/>
      <ellipse cx="174" cy="102" rx="4" ry="13" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.3"/>
      <circle cx="168" cy="122" r="12" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.5"/>
      <ellipse cx="172" cy="138" rx="13" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="164" cy="120" r="1.7" fill="#3b3830"/>
      <circle cx="161" cy="124" r="1.8" fill="#e8b4b8"/>
    </svg>`,
    // 4. Rabbit tugs the green scarf across snowy hill
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e6f1f8"/>
      <path d="M 0 124 Q 90 100 180 128 T 250 118 L 250 180 L 0 180 Z" fill="#fbfaf6" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Sunny surprised -->
      <circle cx="56" cy="126" r="19" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="56" cy="98" r="14" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="56" cy="76" r="11" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 56 76 L 68 78 L 56 80 Z" fill="#e8823a" stroke="#3b3830" stroke-width="1.8"/>
      <!-- Rabbit hopping away with green scarf -->
      <path d="M 102 104 Q 124 94 148 112" fill="none" stroke="#5b8c5a" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="168" cy="118" rx="15" ry="11" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="176" cy="102" r="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.5"/>
      <ellipse cx="172" cy="86" rx="3.5" ry="11" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.2"/>
      <ellipse cx="180" cy="86" rx="3.5" ry="11" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.2"/>
      <circle cx="180" cy="100" r="1.5" fill="#3b3830"/>
    </svg>`,
    // 5. Playing tag around pine trees
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#deecf7"/>
      <path d="M 0 130 Q 125 116 250 130 L 250 180 L 0 180 Z" fill="#fbfaf6" stroke="#3b3830" stroke-width="2.5"/>
      <polygon points="184,48 156,118 212,118" fill="#5b8c5a" stroke="#3b3830" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="179" y="118" width="10" height="16" fill="#9c7a58" stroke="#3b3830" stroke-width="2"/>
      <!-- Girl chasing -->
      <path d="M 64 110 Q 72 96 86 100 L 82 128 L 60 124 Z" fill="#8d7bb8" stroke="#3b3830" stroke-width="2.5"/>
      <line x1="66" y1="125" x2="58" y2="142" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="78" y1="127" x2="88" y2="142" stroke="#3b3830" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="76" cy="84" r="12" fill="#f3d2b3" stroke="#3b3830" stroke-width="2.5"/>
      <path d="M 64 81 Q 76 66 88 81 Z" fill="#e89c5e" stroke="#3b3830" stroke-width="2.3"/>
      <!-- Rabbit hopping -->
      <ellipse cx="136" cy="126" rx="13" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="144" cy="112" r="9" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.4"/>
      <ellipse cx="141" cy="97" rx="3" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.1"/>
      <ellipse cx="148" cy="97" rx="3" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.1"/>
    </svg>`,
    // 6. Golden moon + rabbit tucks scarf back
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#cfdceb"/>
      <path d="M 48 26 A 16 16 0 1 0 64 48 A 12 12 0 1 1 48 26 Z" fill="#f5d76e" stroke="#3b3830" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="198" cy="34" r="2.2" fill="#fffefa"/>
      <circle cx="216" cy="54" r="2.2" fill="#fffefa"/>
      <path d="M 0 132 Q 125 122 250 132 L 250 180 L 0 180 Z" fill="#f7f6f1" stroke="#3b3830" stroke-width="2.5"/>
      <!-- Sunny smiling -->
      <circle cx="110" cy="130" r="22" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="110" cy="98" r="16" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="110" cy="70" r="12" fill="#fffefa" stroke="#3b3830" stroke-width="2.5"/>
      <circle cx="106" cy="67" r="1.8" fill="#292a24"/>
      <circle cx="114" cy="67" r="1.8" fill="#292a24"/>
      <path d="M 110 70 L 122 72 L 110 74 Z" fill="#e8823a" stroke="#3b3830" stroke-width="1.8"/>
      <rect x="96" y="80" width="28" height="8" rx="4" fill="#5b8c5a" stroke="#3b3830" stroke-width="2.3"/>
      <!-- Rabbit tucking scarf -->
      <ellipse cx="154" cy="126" rx="13" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.4"/>
      <circle cx="148" cy="112" r="9" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.4"/>
      <ellipse cx="145" cy="97" rx="3" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.1"/>
      <ellipse cx="152" cy="97" rx="3" ry="10" fill="#f7f5ee" stroke="#3b3830" stroke-width="2.1"/>
    </svg>`,
  ],

  'paper-boat': [
    // 1. Mia folding yellow paper boat with Pip
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f7f3e8"/>
      <rect x="0" y="132" width="250" height="48" fill="#dfd7c5" stroke="#4b4a44" stroke-width="2.3"/>
      <!-- Mia in Red Raincoat -->
      <path d="M 74 108 Q 88 86 104 108 L 112 142 L 66 142 Z" fill="#d96b52" stroke="#4b4a44" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="88" cy="78" r="14" fill="#f3d2b3" stroke="#4b4a44" stroke-width="2.5"/>
      <path d="M 72 78 Q 88 54 104 78" fill="none" stroke="#d96b52" stroke-width="6" stroke-linecap="round"/>
      <circle cx="93" cy="79" r="1.5" fill="#4b4a44"/>
      <!-- Yellow Paper Boat in hands -->
      <polygon points="104,114 142,114 134,126 112,126" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="116,114 123,98 130,114" fill="#fae698" stroke="#4b4a44" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Pip the Dog -->
      <ellipse cx="172" cy="134" rx="16" ry="11" fill="#b5835a" stroke="#4b4a44" stroke-width="2.4"/>
      <circle cx="162" cy="118" r="10" fill="#b5835a" stroke="#4b4a44" stroke-width="2.4"/>
      <rect x="154" y="126" width="16" height="5" rx="2" fill="#5b84b1" stroke="#4b4a44" stroke-width="1.8"/>
      <circle cx="159" cy="116" r="1.5" fill="#4b4a44"/>
    </svg>`,
    // 2. Launch in garden puddle
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#e9f0f4"/>
      <line x1="36" y1="22" x2="32" y2="34" stroke="#8aa8bf" stroke-width="2" stroke-linecap="round"/>
      <line x1="204" y1="26" x2="200" y2="38" stroke="#8aa8bf" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0 124 Q 125 114 250 124 L 250 180 L 0 180 Z" fill="#c7d8bd" stroke="#4b4a44" stroke-width="2.4"/>
      <ellipse cx="154" cy="148" rx="64" ry="18" fill="#a2cbe0" stroke="#4b4a44" stroke-width="2.3"/>
      <!-- Boat floating -->
      <polygon points="134,142 174,142 166,152 142,152" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="146,142 154,126 162,142" fill="#fae698" stroke="#4b4a44" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Mia kneeling -->
      <path d="M 60 106 Q 74 86 88 106 L 94 136 L 54 136 Z" fill="#d96b52" stroke="#4b4a44" stroke-width="2.5"/>
      <circle cx="74" cy="78" r="13" fill="#f3d2b3" stroke="#4b4a44" stroke-width="2.5"/>
      <circle cx="79" cy="78" r="1.5" fill="#4b4a44"/>
    </svg>`,
    // 3. Down the cobblestone stream
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#edece6"/>
      <!-- Cobble Path & Winding Stream -->
      <path d="M 0 110 Q 90 104 160 124 T 250 118 L 250 180 L 0 180 Z" fill="#d9d4c7" stroke="#4b4a44" stroke-width="2.3"/>
      <path d="M 0 132 Q 95 118 160 140 T 250 136 L 250 162 Q 160 166 95 144 T 0 156 Z" fill="#9bc7e0" stroke="#4b4a44" stroke-width="2.3"/>
      <!-- Yellow Boat sailing -->
      <polygon points="118,128 160,128 152,140 126,140" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.3" stroke-linejoin="round"/>
      <polygon points="131,128 139,110 147,128" fill="#fae698" stroke="#4b4a44" stroke-width="2.3" stroke-linejoin="round"/>
      <circle cx="48" cy="164" r="6" fill="#c9c3b4" stroke="#4b4a44" stroke-width="1.8"/>
      <circle cx="204" cy="166" r="7" fill="#c9c3b4" stroke="#4b4a44" stroke-width="1.8"/>
    </svg>`,
    // 4. Mia and Pip racing along the lane
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef3f6"/>
      <path d="M 0 126 L 250 126 L 250 180 L 0 180 Z" fill="#d8d4c8" stroke="#4b4a44" stroke-width="2.3"/>
      <rect x="0" y="148" width="250" height="22" fill="#9bc7e0" stroke="#4b4a44" stroke-width="2.2"/>
      <!-- Mia running -->
      <path d="M 64 98 Q 76 80 88 98 L 94 128 L 58 128 Z" fill="#d96b52" stroke="#4b4a44" stroke-width="2.5"/>
      <line x1="68" y1="128" x2="60" y2="142" stroke="#4b4a44" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="84" y1="128" x2="94" y2="142" stroke="#4b4a44" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="76" cy="72" r="12" fill="#f3d2b3" stroke="#4b4a44" stroke-width="2.5"/>
      <!-- Pip running -->
      <ellipse cx="136" cy="126" rx="15" ry="10" fill="#b5835a" stroke="#4b4a44" stroke-width="2.4"/>
      <circle cx="146" cy="112" r="9" fill="#b5835a" stroke="#4b4a44" stroke-width="2.4"/>
      <rect x="137" y="119" width="14" height="5" rx="2" fill="#5b84b1" stroke="#4b4a44" stroke-width="1.8"/>
      <!-- Boat ahead -->
      <polygon points="184,144 222,144 214,154 192,154" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.2"/>
      <polygon points="196,144 203,128 210,144" fill="#fae698" stroke="#4b4a44" stroke-width="2.2"/>
    </svg>`,
    // 5. Calm park pond with lily pads
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eaf2f5"/>
      <path d="M 0 98 Q 125 88 250 98 L 250 180 L 0 180 Z" fill="#c7dcbc" stroke="#4b4a44" stroke-width="2.3"/>
      <ellipse cx="125" cy="138" rx="100" ry="32" fill="#9cc6de" stroke="#4b4a44" stroke-width="2.5"/>
      <ellipse cx="70" cy="144" rx="18" ry="7" fill="#7fb069" stroke="#4b4a44" stroke-width="2.1"/>
      <ellipse cx="180" cy="132" rx="16" ry="6" fill="#7fb069" stroke="#4b4a44" stroke-width="2.1"/>
      <polygon points="104,132 148,132 140,144 112,144" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.3" stroke-linejoin="round"/>
      <polygon points="118,132 126,112 134,132" fill="#fae698" stroke="#4b4a44" stroke-width="2.3" stroke-linejoin="round"/>
    </svg>`,
    // 6. Green frog captain & Mia cheering on bridge
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#edf4f7"/>
      <rect x="0" y="114" width="250" height="66" fill="#9cc6de" stroke="#4b4a44" stroke-width="2.3"/>
      <!-- Wooden Bridge -->
      <path d="M 0 104 Q 65 82 118 104" fill="none" stroke="#a6815c" stroke-width="8" stroke-linecap="round"/>
      <path d="M 0 92 Q 65 70 118 92" fill="none" stroke="#8a6847" stroke-width="3" stroke-linecap="round"/>
      <!-- Mia waving on bridge -->
      <path d="M 42 74 Q 52 58 62 74 L 66 96 L 38 96 Z" fill="#d96b52" stroke="#4b4a44" stroke-width="2.3"/>
      <circle cx="52" cy="52" r="10" fill="#f3d2b3" stroke="#4b4a44" stroke-width="2.3"/>
      <path d="M 62 72 L 74 58" stroke="#4b4a44" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Boat & Captain Frog -->
      <polygon points="140,142 194,142 184,156 150,156" fill="#f5db7b" stroke="#4b4a44" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="158,142 167,120 176,142" fill="#fae698" stroke="#4b4a44" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="148" cy="134" rx="10" ry="8" fill="#7fb069" stroke="#4b4a44" stroke-width="2.2"/>
      <circle cx="144" cy="126" r="3.5" fill="#7fb069" stroke="#4b4a44" stroke-width="1.8"/>
      <circle cx="152" cy="126" r="3.5" fill="#7fb069" stroke="#4b4a44" stroke-width="1.8"/>
    </svg>`,
  ],

  'little-blue-robot': [
    // 1. Cozy workshop with arched window
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f6efe2"/>
      <rect x="0" y="136" width="250" height="44" fill="#d9c2a3" stroke="#292a24" stroke-width="2.6"/>
      <!-- Arched Window -->
      <path d="M 148 112 L 148 54 A 30 30 0 0 1 208 54 L 208 112 Z" fill="#cde5f5" stroke="#292a24" stroke-width="3" stroke-linejoin="round"/>
      <line x1="178" y1="24" x2="178" y2="112" stroke="#292a24" stroke-width="2.5"/>
      <line x1="148" y1="74" x2="208" y2="74" stroke="#292a24" stroke-width="2.5"/>
      <!-- Blue Robot -->
      <line x1="88" y1="54" x2="88" y2="40" stroke="#292a24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="88" cy="36" r="5" fill="#f7d86b" stroke="#292a24" stroke-width="2.5"/>
      <path d="M 62 78 A 26 24 0 0 1 114 78 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3" stroke-linejoin="round"/>
      <rect x="58" y="78" width="60" height="46" rx="16" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="77" cy="68" r="5" fill="#f7d86b" stroke="#292a24" stroke-width="2.2"/>
      <circle cx="99" cy="68" r="5" fill="#f7d86b" stroke="#292a24" stroke-width="2.2"/>
      <path d="M 80 92 Q 88 99 96 92" fill="none" stroke="#292a24" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="74" y1="124" x2="74" y2="142" stroke="#292a24" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="102" y1="124" x2="102" y2="142" stroke="#292a24" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
    // 2. Watering the window sunflower
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f5efe2"/>
      <rect x="0" y="138" width="250" height="42" fill="#d9c2a3" stroke="#292a24" stroke-width="2.6"/>
      <!-- Sunflower in Pot -->
      <polygon points="164,114 194,114 188,142 170,142" fill="#c77954" stroke="#292a24" stroke-width="2.8" stroke-linejoin="round"/>
      <line x1="179" y1="114" x2="179" y2="76" stroke="#6b9e63" stroke-width="4" stroke-linecap="round"/>
      <circle cx="179" cy="64" r="17" fill="#f4c44e" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="179" cy="64" r="8" fill="#7a5c3e" stroke="#292a24" stroke-width="2.2"/>
      <!-- Robot with watering can -->
      <line x1="78" y1="58" x2="78" y2="44" stroke="#292a24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="78" cy="40" r="5" fill="#f7d86b" stroke="#292a24" stroke-width="2.5"/>
      <path d="M 54 80 A 24 22 0 0 1 102 80 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <rect x="52" y="80" width="52" height="44" rx="14" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="69" cy="71" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <circle cx="87" cy="71" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <rect x="112" y="82" width="22" height="18" rx="4" fill="#9bc7e0" stroke="#292a24" stroke-width="2.6"/>
      <line x1="134" y1="88" x2="152" y2="78" stroke="#292a24" stroke-width="3" stroke-linecap="round"/>
      <line x1="158" y1="84" x2="162" y2="94" stroke="#6ea6cf" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="166" y1="82" x2="170" y2="92" stroke="#6ea6cf" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    // 3. Orange songbird tapping on window during wind
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef0f2"/>
      <path d="M 110 24 L 224 24 L 224 140 L 110 140 Z" fill="#cbe0ee" stroke="#292a24" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 122 50 Q 158 40 192 52" fill="none" stroke="#85a6bd" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Orange Songbird outside glass -->
      <ellipse cx="164" cy="96" rx="14" ry="11" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="152" cy="86" r="8" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <polygon points="144,86 136,89 144,92" fill="#f4c97a" stroke="#292a24" stroke-width="2"/>
      <circle cx="150" cy="84" r="1.6" fill="#292a24"/>
      <!-- Robot looking surprised inside -->
      <path d="M 38 86 A 24 22 0 0 1 86 86 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <rect x="36" y="86" width="52" height="48" rx="14" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="53" cy="77" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <circle cx="71" cy="77" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
    </svg>`,
    // 4. Holding out a warm teacup
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f7efe0"/>
      <rect x="0" y="138" width="250" height="42" fill="#d9c2a3" stroke="#292a24" stroke-width="2.6"/>
      <!-- Blue Robot -->
      <path d="M 52 78 A 24 22 0 0 1 100 78 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <rect x="50" y="78" width="52" height="46" rx="14" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="67" cy="69" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <circle cx="85" cy="69" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <line x1="102" y1="98" x2="128" y2="98" stroke="#292a24" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Warm Teacup -->
      <path d="M 128 90 L 154 90 Q 152 108 141 108 Q 130 108 128 90 Z" fill="#fffefa" stroke="#292a24" stroke-width="2.6"/>
      <path d="M 136 82 Q 133 74 138 68" fill="none" stroke="#c9b8a3" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M 145 82 Q 142 74 147 68" fill="none" stroke="#c9b8a3" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Orange Bird warming up -->
      <ellipse cx="182" cy="100" rx="13" ry="10" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="172" cy="90" r="8" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="170" cy="88" r="1.6" fill="#292a24"/>
    </svg>`,
    // 5. Bird singing & antenna glowing
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#f5ede0"/>
      <circle cx="84" cy="36" r="18" fill="#fae596" opacity="0.7"/>
      <line x1="84" y1="54" x2="84" y2="40" stroke="#292a24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="84" cy="36" r="6" fill="#f7d86b" stroke="#292a24" stroke-width="2.5"/>
      <path d="M 60 78 A 24 22 0 0 1 108 78 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <rect x="58" y="78" width="52" height="46" rx="14" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="75" cy="69" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <circle cx="93" cy="69" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <!-- Bird singing + music notes -->
      <ellipse cx="174" cy="104" rx="14" ry="10" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="164" cy="94" r="8" fill="#eb9458" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="144" cy="66" r="4" fill="#292a24"/>
      <path d="M 148 66 L 148 48 L 160 52" fill="none" stroke="#292a24" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    // 6. Bird perched on sunflower waving goodbye
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 180" preserveAspectRatio="xMidYMid slice">
      <rect width="250" height="180" fill="#eef6fc"/>
      <circle cx="204" cy="38" r="18" fill="#fae08c" stroke="#292a24" stroke-width="2.6"/>
      <rect x="0" y="138" width="250" height="42" fill="#c8dfb9" stroke="#292a24" stroke-width="2.6"/>
      <!-- Sunflower -->
      <polygon points="154,116 184,116 178,142 160,142" fill="#c77954" stroke="#292a24" stroke-width="2.6"/>
      <line x1="169" y1="116" x2="169" y2="76" stroke="#6b9e63" stroke-width="4" stroke-linecap="round"/>
      <circle cx="169" cy="66" r="18" fill="#f4c44e" stroke="#292a24" stroke-width="2.6"/>
      <circle cx="169" cy="66" r="8" fill="#7a5c3e" stroke="#292a24" stroke-width="2.2"/>
      <!-- Bird on Sunflower -->
      <ellipse cx="168" cy="44" rx="11" ry="8" fill="#eb9458" stroke="#292a24" stroke-width="2.4"/>
      <circle cx="160" cy="36" r="6.5" fill="#eb9458" stroke="#292a24" stroke-width="2.4"/>
      <!-- Robot waving -->
      <path d="M 58 84 A 24 22 0 0 1 106 84 Z" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <rect x="56" y="84" width="52" height="46" rx="14" fill="#7fa8c9" stroke="#292a24" stroke-width="3"/>
      <circle cx="73" cy="75" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <circle cx="91" cy="75" r="4.5" fill="#f7d86b" stroke="#292a24" stroke-width="2"/>
      <line x1="108" y1="96" x2="128" y2="76" stroke="#292a24" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
  ],
};
