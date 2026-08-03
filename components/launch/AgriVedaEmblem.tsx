/** Stylized joyful farmer + wheat/leaf in dark-green emblem — crisp SVG for splash. */
export default function AgriVedaEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="AgriVeda"
    >
      <defs>
        <linearGradient id="av-emblem-bg" x1="20" y1="10" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#265A4C" />
          <stop offset="1" stopColor="#1E4D40" />
        </linearGradient>
        <linearGradient id="av-leaf" x1="90" y1="40" x2="130" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EEAD4" />
          <stop offset="1" stopColor="#00A86B" />
        </linearGradient>
        <linearGradient id="av-gold" x1="40" y1="50" x2="70" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0D78C" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Emblem disc */}
      <circle cx="80" cy="80" r="74" fill="url(#av-emblem-bg)" />
      <circle cx="80" cy="80" r="68" fill="none" stroke="#D4AF37" strokeWidth="2.5" opacity="0.85" />
      <circle cx="80" cy="80" r="62" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.18" />

      {/* Soft glow */}
      <ellipse cx="80" cy="118" rx="36" ry="8" fill="#000" opacity="0.18" />

      {/* Wheat stalk (gold) — held aloft */}
      <g>
        <path
          d="M78 118 C76 96 72 78 68 58"
          fill="none"
          stroke="url(#av-gold)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <ellipse cx="62" cy="52" rx="7" ry="12" fill="url(#av-gold)" transform="rotate(-28 62 52)" />
        <ellipse cx="70" cy="46" rx="6.5" ry="11" fill="url(#av-gold)" transform="rotate(-8 70 46)" />
        <ellipse cx="78" cy="48" rx="6" ry="10" fill="url(#av-gold)" transform="rotate(18 78 48)" />
        <ellipse cx="58" cy="62" rx="5.5" ry="9" fill="#C9A227" transform="rotate(-35 58 62)" opacity="0.9" />
      </g>

      {/* Green leaf in other hand */}
      <path
        d="M98 70 C118 52 132 58 128 78 C124 96 108 102 98 90 C102 82 104 76 98 70 Z"
        fill="url(#av-leaf)"
      />
      <path
        d="M102 74 C112 68 120 70 122 80"
        fill="none"
        stroke="#ECFDF5"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Joyful figure — simplified silhouette leaping */}
      <g fill="#F8F9FA">
        {/* Head */}
        <circle cx="86" cy="66" r="9.5" />
        {/* Torso leaning up */}
        <path d="M80 76 C84 78 90 80 94 78 L100 102 C96 106 84 108 78 104 Z" />
        {/* Arms up in joy */}
        <path
          d="M84 82 C72 70 64 62 58 54"
          fill="none"
          stroke="#F8F9FA"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M92 80 C104 72 114 66 122 62"
          fill="none"
          stroke="#F8F9FA"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Legs mid-jump */}
        <path
          d="M82 102 C74 112 66 122 62 130"
          fill="none"
          stroke="#F8F9FA"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        <path
          d="M90 104 C98 114 108 122 116 128"
          fill="none"
          stroke="#F8F9FA"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
