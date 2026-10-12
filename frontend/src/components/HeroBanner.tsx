import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <header className="w-full overflow-hidden bg-[#05070a] border-b border-[#1f2937] select-none shrink-0">
      <svg
        viewBox="0 0 1392 250"
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle red glow for heading contours and diagnostic accents */}
          <filter id="subtle-red-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Fine horizontal scanline pattern for text interior texture */}
          <pattern id="glyph-scanlines" width="20" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="1" x2="20" y2="1" stroke="#e2e8f0" strokeWidth="0.9" opacity="0.85" />
            <line x1="2" y1="3" x2="16" y2="3" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="3 1 4 2" opacity="0.6" />
          </pattern>

          {/* Matrix micro-dot pattern for world map continents & hacker fabric */}
          <pattern id="matrix-dot-grid" width="3.6" height="3.6" patternUnits="userSpaceOnUse">
            <circle cx="1.8" cy="1.8" r="0.7" fill="#64748b" opacity="0.45" />
          </pattern>

          {/* Denser dot pattern for continental landmasses */}
          <pattern id="dense-map-dots" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.6" fill="#94a3b8" opacity="0.4" />
          </pattern>

          {/* Clip path defining the tall squared DEFCON typography */}
          <clipPath id="defcon-text-mask">
            <text
              x="696"
              y="114"
              textAnchor="middle"
              fontFamily="'Oxanium', 'Rajdhani', sans-serif"
              fontWeight="900"
              fontSize="118"
              letterSpacing="0.08em"
            >
              DEFCON
            </text>
          </clipPath>
        </defs>

        {/* Global Dark Background */}
        <rect width="1392" height="250" fill="#05070a" />

        {/* Subtle Horizontal Scanlines across full banner */}
        <g opacity="0.12">
          {Array.from({ length: 62 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 4}
              x2="1392"
              y2={i * 4}
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* =========================================================================
            1. LEFT BACKGROUND: AUTHENTIC DETAILED DOTTED WORLD MAP & SKYLINE
            ========================================================================= */}
        <g id="left-world-map-and-skyline" opacity="0.65">
          {/* North America detailed silhouette */}
          <path
            d="M32,48 C45,35 70,30 92,34 C104,36 122,48 118,62 C115,74 135,68 142,78 C145,86 130,96 120,98 C108,100 102,112 92,122 C82,128 70,122 62,110 C52,98 44,102 38,90 C30,78 24,58 32,48 Z"
            fill="url(#dense-map-dots)"
          />
          {/* Greenland */}
          <path
            d="M138,28 C150,24 168,28 165,42 C160,52 144,54 136,46 C132,40 132,32 138,28 Z"
            fill="url(#dense-map-dots)"
          />
          {/* South America detailed silhouette */}
          <path
            d="M88,126 C105,124 125,135 122,154 C118,172 108,198 94,216 C84,224 76,212 78,194 C80,175 75,152 78,138 C80,130 82,126 88,126 Z"
            fill="url(#dense-map-dots)"
          />
          {/* Europe & Scandinavia */}
          <path
            d="M172,36 C188,30 206,34 212,48 C216,62 198,72 184,72 C174,70 166,54 172,36 Z"
            fill="url(#dense-map-dots)"
          />
          <path
            d="M188,20 C198,16 208,22 205,34 C200,40 190,36 188,28 Z"
            fill="url(#dense-map-dots)"
          />
          {/* Africa */}
          <path
            d="M174,78 C196,75 220,85 224,108 C228,128 214,158 196,172 C182,176 172,158 174,136 C176,116 166,92 174,78 Z"
            fill="url(#dense-map-dots)"
          />
          {/* Asia & Eurasia Continental Sweep */}
          <path
            d="M214,35 C240,28 290,32 305,52 C315,70 295,95 272,98 C255,100 248,118 238,122 C228,115 224,88 220,68 C218,50 210,40 214,35 Z"
            fill="url(#dense-map-dots)"
          />
          <path
            d="M242,98 C258,98 266,116 258,132 C252,142 240,140 236,128 C234,115 238,102 242,98 Z"
            fill="url(#dense-map-dots)"
          />
          {/* Australia & Archipelago */}
          <path
            d="M285,142 C305,138 322,148 318,168 C314,182 296,188 282,180 C274,170 275,150 285,142 Z"
            fill="url(#dense-map-dots)"
          />

          {/* Architectural City Skyline Silhouettes with Transmitter Spires */}
          <g stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.65">
            {/* Tower 1 */}
            <rect x="236" y="85" width="22" height="150" />
            <line x1="247" y1="62" x2="247" y2="85" stroke="#475569" strokeWidth="1" />
            <circle cx="247" cy="62" r="1.5" fill="#ef4444" opacity="0.8" />
            <line x1="240" y1="100" x2="254" y2="100" />
            <line x1="240" y1="120" x2="254" y2="120" />
            <line x1="240" y1="140" x2="254" y2="140" />
            <line x1="240" y1="160" x2="254" y2="160" />
            <line x1="240" y1="180" x2="254" y2="180" />

            {/* Tower 2 */}
            <rect x="264" y="115" width="16" height="120" />
            <line x1="272" y1="98" x2="272" y2="115" stroke="#475569" strokeWidth="0.9" />
            <line x1="267" y1="130" x2="277" y2="130" />
            <line x1="267" y1="150" x2="277" y2="150" />
            <line x1="267" y1="170" x2="277" y2="170" />

            {/* Tower 3 */}
            <rect x="286" y="100" width="26" height="135" />
            <line x1="299" y1="78" x2="299" y2="100" stroke="#475569" strokeWidth="1" />
            <circle cx="299" cy="78" r="1.2" fill="#ef4444" opacity="0.75" />
            <line x1="290" y1="115" x2="308" y2="115" />
            <line x1="290" y1="135" x2="308" y2="135" />
            <line x1="290" y1="155" x2="308" y2="155" />

            {/* Stepped Building 4 */}
            <path d="M318,135 L332,135 L332,120 L346,120 L346,235 L318,235 Z" />
            <line x1="339" y1="105" x2="339" y2="120" stroke="#475569" strokeWidth="0.8" />
          </g>

          {/* Left Horizontal Interference & Diagnostic Markers */}
          <g stroke="#ef4444" strokeWidth="1.1" opacity="0.75">
            <line x1="45" y1="145" x2="72" y2="145" strokeDasharray="3 2" />
            <line x1="135" y1="168" x2="175" y2="168" strokeDasharray="4 2 8 3" />
            <line x1="20" y1="95" x2="36" y2="95" strokeDasharray="2 2" />

            {/* Diagnostic Crosshairs */}
            <line x1="125" y1="22" x2="135" y2="22" />
            <line x1="130" y1="17" x2="130" y2="27" />

            <line x1="228" y1="42" x2="238" y2="42" />
            <line x1="233" y1="37" x2="233" y2="47" />
          </g>
        </g>

        {/* =========================================================================
            2. CENTER: DEFCON DOMINANT HEADING (OCCUPIES ~48% BANNER WIDTH)
            ========================================================================= */}
        {/* Background Building Silhouettes directly behind DEFCON letters */}
        <g stroke="#1e293b" strokeWidth="0.9" fill="none" opacity="0.45">
          <rect x="420" y="70" width="28" height="150" />
          <line x1="434" y1="50" x2="434" y2="70" />
          <rect x="540" y="85" width="22" height="135" />
          <rect x="730" y="60" width="32" height="160" />
          <line x1="746" y1="42" x2="746" y2="60" stroke="#ef4444" strokeWidth="1" />
          <rect x="880" y="78" width="24" height="142" />
        </g>

        {/* DEFCON Glyph Interior Scanlines & Code Slices (Clipped to Letter Shapes) */}
        <g clipPath="url(#defcon-text-mask)">
          {/* Base letter fill */}
          <rect x="340" y="10" width="712" height="115" fill="#090d14" />

          {/* Fine horizontal scanlines inside letters */}
          <rect x="340" y="10" width="712" height="115" fill="url(#glyph-scanlines)" />

          {/* Terminal glitch slices & horizontal code breaks */}
          <g opacity="0.75">
            <line x1="360" y1="32" x2="1020" y2="32" stroke="#05070a" strokeWidth="1.5" />
            <line x1="370" y1="52" x2="1010" y2="52" stroke="#05070a" strokeWidth="1.2" />
            <line x1="365" y1="74" x2="1015" y2="74" stroke="#05070a" strokeWidth="1.8" />
            <line x1="380" y1="94" x2="1005" y2="94" stroke="#05070a" strokeWidth="1.4" />

            {/* Bright micro-highlights */}
            <line x1="385" y1="44" x2="445" y2="44" stroke="#f8fafc" strokeWidth="1.6" />
            <line x1="490" y1="62" x2="550" y2="62" stroke="#f8fafc" strokeWidth="1.6" />
            <line x1="595" y1="40" x2="655" y2="40" stroke="#f8fafc" strokeWidth="1.6" />
            <line x1="710" y1="68" x2="770" y2="68" stroke="#f8fafc" strokeWidth="1.6" />
            <line x1="820" y1="48" x2="880" y2="48" stroke="#f8fafc" strokeWidth="1.6" />
            <line x1="930" y1="64" x2="990" y2="64" stroke="#f8fafc" strokeWidth="1.6" />
          </g>
        </g>

        {/* Fragmented Red Dashed Outline with Restrained Glow */}
        <text
          x="696"
          y="114"
          textAnchor="middle"
          fontFamily="'Oxanium', 'Rajdhani', sans-serif"
          fontWeight="900"
          fontSize="118"
          letterSpacing="0.08em"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.7"
          strokeDasharray="9 3 14 3 6 4 18 3"
          opacity="0.95"
          filter="url(#subtle-red-glow)"
        >
          DEFCON
        </text>

        {/* Additional crisp un-blurred overlay stroke for sharp technical edges */}
        <text
          x="696"
          y="114"
          textAnchor="middle"
          fontFamily="'Oxanium', 'Rajdhani', sans-serif"
          fontWeight="900"
          fontSize="118"
          letterSpacing="0.08em"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.1"
          strokeDasharray="14 4 8 2 12 3"
          opacity="0.85"
        >
          DEFCON
        </text>

        {/* Subtle Framing Bracket Ticks at DEFCON Perimeters */}
        <g stroke="#ef4444" strokeWidth="1.4" opacity="0.8">
          {/* Top-left tick */}
          <path d="M352,36 L352,24 L368,24" fill="none" />
          {/* Top-right tick */}
          <path d="M1040,36 L1040,24 L1024,24" fill="none" />
          {/* Bottom-left tick */}
          <path d="M352,104 L352,116 L368,116" fill="none" />
          {/* Bottom-right tick */}
          <path d="M1040,104 L1040,116 L1024,116" fill="none" />
        </g>

        {/* =========================================================================
            3. CENTER TEXT BLOCK (DIRECTLY BENEATH DEFCON)
            ========================================================================= */}
        <g transform="translate(696, 148)" textAnchor="middle">
          {/* Line 1: RECON | BREACH | EXPLOIT (Vibrant Red) */}
          <text
            y="0"
            fill="#ef4444"
            fontFamily="'Oxanium', 'JetBrains Mono', monospace"
            fontSize="15.5"
            fontWeight="700"
            letterSpacing="0.28em"
          >
            RECON &nbsp;|&nbsp; BREACH &nbsp;|&nbsp; EXPLOIT
          </text>

          {/* Line 2: A 4 HOUR ATTACK - DEFENSE CYBERWARFARE COMPETITION (Subdued Off-White) */}
          <text
            y="23"
            fill="#e2e8f0"
            fontFamily="'Oxanium', 'JetBrains Mono', monospace"
            fontSize="12.5"
            fontWeight="600"
            letterSpacing="0.16em"
          >
            A 4 HOUR ATTACK - DEFENSE CYBERWARFARE COMPETITION
          </text>

          {/* Line 3 & 4: Quotation in 2 Lines (Small Muted Gray Italic) */}
          <text
            y="47"
            fill="#94a3b8"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10.8"
            fontStyle="italic"
            letterSpacing="0.04em"
          >
            &ldquo;Some systems wait to be used.
          </text>
          <text
            y="62"
            fill="#94a3b8"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10.8"
            fontStyle="italic"
            letterSpacing="0.04em"
          >
            Ours wait to be broken.&rdquo;
          </text>
        </g>

        {/* =========================================================================
            4. RIGHT-SIDE: DETAILED ORGANIC HOODED HACKER & OBJECTIVES COLUMN
            ========================================================================= */}
        <g id="right-hooded-figure-and-objectives" transform="translate(1040, 20)">
          {/* City Skyline rising behind hacker's shoulder */}
          <g stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.55">
            <rect x="0" y="82" width="18" height="135" />
            <line x1="9" y1="64" x2="9" y2="82" stroke="#475569" strokeWidth="1" />
            <circle cx="9" cy="64" r="1.2" fill="#ef4444" opacity="0.8" />
            <rect x="24" y="104" width="16" height="113" />
            <line x1="32" y1="90" x2="32" y2="104" stroke="#475569" strokeWidth="0.8" />
          </g>

          {/* ORGANIC HOODED HACKER SILHOUETTE */}
          <g id="hooded-hacker-silhouette" transform="translate(42, 2)">
            {/* 1. Hood & Shoulders Texture Fill (Fine matrix dots) */}
            <path
              d="M72,16 C98,14 126,24 136,65 C146,108 158,154 186,205 L-36,205 C-8,154 4,108 14,65 C24,24 52,14 72,16 Z"
              fill="url(#matrix-dot-grid)"
            />

            {/* 2. Dark Negative Space Void for Hidden Face Shadow (Pure Darkness) */}
            <path
              d="M72,42 C92,44 105,72 102,112 C98,144 88,168 72,168 C56,168 46,144 42,112 C39,72 52,44 72,42 Z"
              fill="#05070a"
            />
            {/* Inner cowl shadow border */}
            <path
              d="M72,42 C92,44 105,72 102,112 C98,144 88,168 72,168 C56,168 46,144 42,112 C39,72 52,44 72,42 Z"
              fill="none"
              stroke="#475569"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.8"
            />

            {/* 3. Organic Fabric Folds along Shoulders and Chest */}
            <path
              d="M38,155 C52,175 64,188 72,196"
              fill="none"
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.6"
            />
            <path
              d="M106,155 C92,175 80,188 72,196"
              fill="none"
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.6"
            />
            <path
              d="M14,142 C30,165 48,188 62,205"
              fill="none"
              stroke="#475569"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <path
              d="M130,142 C114,165 96,188 82,205"
              fill="none"
              stroke="#475569"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.5"
            />

            {/* 4. Fragmented Thin Red Outer Contour */}
            <path
              d="M72,14 C100,12 128,22 138,65 C148,110 160,156 188,206"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="8 3 14 4 6 3"
              opacity="0.88"
            />
            <path
              d="M72,14 C44,12 16,22 6,65 C-4,110 -16,156 -38,206"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="8 3 14 4 6 3"
              opacity="0.88"
            />

            {/* Subtle inner gray contour line */}
            <path
              d="M72,22 C94,20 118,30 126,68 C134,106 145,150 170,198"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.9"
              strokeDasharray="5 2"
              opacity="0.6"
            />
            <path
              d="M72,22 C50,20 26,30 18,68 C10,106 -1,150 -20,198"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.9"
              strokeDasharray="5 2"
              opacity="0.6"
            />
          </g>

          {/* FAR RIGHT MISSION OBJECTIVES COLUMN */}
          <g transform="translate(236, 42)" fontFamily="'Oxanium', 'JetBrains Mono', monospace">
            <text x="0" y="0" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="0.18em">FIND</text>
            <text x="0" y="21" fill="#ef4444" fontSize="12" fontWeight="700" letterSpacing="0.18em">EXPLOIT</text>
            <text x="0" y="42" fill="#cbd5e1" fontSize="12" fontWeight="700" letterSpacing="0.18em">DEFEND</text>
            <text x="0" y="63" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="0.18em">DOMINATE</text>

            {/* Prompt with animated blinking cursor */}
            <text x="0" y="94" fill="#ef4444" fontSize="15" fontWeight="bold">
              &gt;<tspan className="animate-pulse">_</tspan>
            </text>
          </g>
        </g>

        {/* Scattered Red Glitch Fragments & Technical Markers on Right */}
        <g stroke="#ef4444" strokeWidth="1.1" opacity="0.8">
          <line x1="995" y1="48" x2="1007" y2="48" />
          <line x1="1001" y1="42" x2="1001" y2="54" />

          <line x1="1035" y1="165" x2="1055" y2="165" strokeDasharray="3 2" />
          <line x1="1265" y1="28" x2="1285" y2="28" strokeDasharray="4 2" />

          <line x1="1340" y1="45" x2="1350" y2="45" />
          <line x1="1345" y1="40" x2="1345" y2="50" />
        </g>
      </svg>
    </header>
  );
};