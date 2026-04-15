function CricketPosterCard({ variant = "stadium", title, subtitle }) {
  return (
    <article className="poster-card">
      <div className={`poster-card__art poster-card__art--${variant}`}>
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 320 220" fill="none">
          <defs>
            <linearGradient id={`${variant}-bg`} x1="40" y1="20" x2="280" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#163f5d" />
              <stop offset="55%" stopColor="#0b78b3" />
              <stop offset="100%" stopColor="#081120" />
            </linearGradient>
            <linearGradient id={`${variant}-field`} x1="160" y1="100" x2="160" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5fe17d" />
              <stop offset="100%" stopColor="#0b5d2b" />
            </linearGradient>
          </defs>

          <rect x="16" y="14" width="288" height="192" rx="28" fill={`url(#${variant}-bg)`} />
          <circle cx="248" cy="52" r="36" fill="#7fdbff" fillOpacity="0.18" />
          <ellipse cx="160" cy="168" rx="108" ry="28" fill={`url(#${variant}-field)`} />

          {variant === "trophy" ? (
            <g>
              <path d="M131 70h58v16c0 16-13 29-29 29s-29-13-29-29V70Z" fill="#f8b756" />
              <path d="M131 75h-16c-9 0-16 7-16 16 0 14 11 25 25 25h7" stroke="#f8d28b" strokeWidth="8" strokeLinecap="round" />
              <path d="M189 75h16c9 0 16 7 16 16 0 14-11 25-25 25h-7" stroke="#f8d28b" strokeWidth="8" strokeLinecap="round" />
              <path d="M160 115v26m-22 18h44m-35-18h26" stroke="#ffe9b9" strokeWidth="8" strokeLinecap="round" />
            </g>
          ) : null}

          {variant === "stadium" ? (
            <g>
              <path d="M72 136c22-18 52-28 88-28s66 10 88 28" stroke="#d7f4ff" strokeOpacity="0.7" strokeWidth="8" strokeLinecap="round" />
              {[88, 112, 136, 184, 208, 232].map((x) => (
                <path key={x} d={`M${x} 132V80`} stroke="#d7f4ff" strokeOpacity="0.55" strokeWidth="7" strokeLinecap="round" />
              ))}
              <path d="M64 164h192" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="4" />
            </g>
          ) : null}

          {variant === "strategy" ? (
            <g>
              <rect x="88" y="66" width="144" height="94" rx="16" fill="#0f172a" fillOpacity="0.56" />
              <path d="M108 88h104M108 112h70M108 136h48" stroke="#d7f4ff" strokeWidth="6" strokeLinecap="round" />
              <circle cx="230" cy="128" r="12" fill="#f97316" />
              <path d="M216 142 196 160" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
            </g>
          ) : null}

          <circle cx="92" cy="54" r="8" fill="#f97316">
            <animate attributeName="cy" values="54;48;54" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="poster-card__content">
        <p className="poster-card__title">{title}</p>
        <p className="poster-card__subtitle">{subtitle}</p>
      </div>
    </article>
  );
}

export default CricketPosterCard;
