import { useId } from "react";

function CricketMotionScene({ className = "", compact = false }) {
  const sceneId = useId().replace(/:/g, "");
  const skyGradientId = `${sceneId}-sky`;
  const fieldGradientId = `${sceneId}-field`;
  const glowGradientId = `${sceneId}-glow`;
  const scoreGradientId = `${sceneId}-score`;
  const sizeClass = compact ? "min-h-[250px]" : "min-h-[300px] sm:min-h-[360px]";

  return (
    <div className={`cricket-scene ${sizeClass} ${className}`.trim()}>
      <div className="cricket-scene__badge">Cricket Pulse</div>
      <div className="cricket-scene__score animate-float-delay">
        <span>Match Ready</span>
        <strong>11 v 11</strong>
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 360"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={skyGradientId} x1="68" y1="52" x2="444" y2="324" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#163f5d" />
            <stop offset="55%" stopColor="#0b78b3" />
            <stop offset="100%" stopColor="#081120" />
          </linearGradient>
          <linearGradient id={fieldGradientId} x1="260" y1="120" x2="260" y2="316" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#42c66f" />
            <stop offset="100%" stopColor="#0b5d2b" />
          </linearGradient>
          <radialGradient id={glowGradientId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(350 86) rotate(90) scale(94 118)">
            <stop offset="0%" stopColor="#7fdbff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7fdbff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={scoreGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="48" y="40" width="424" height="284" rx="54" fill={`url(#${skyGradientId})`} />
        <ellipse cx="356" cy="78" rx="110" ry="88" fill={`url(#${glowGradientId})`} />

        <g opacity="0.35">
          <path d="M48 146H472" stroke="white" strokeOpacity="0.18" />
          <path d="M48 194H472" stroke="white" strokeOpacity="0.12" />
          <path d="M48 242H472" stroke="white" strokeOpacity="0.12" />
        </g>

        <g opacity="0.55">
          {[70, 90, 110, 130, 150, 170, 350, 370, 390, 410, 430].map((x, index) => (
            <rect
              key={`crowd-${x}`}
              x={x}
              y={88 + (index % 3) * 4}
              width="12"
              height={22 + (index % 4) * 8}
              rx="6"
              fill="#d7f4ff"
              fillOpacity={0.22 + (index % 3) * 0.08}
            >
              <animate
                attributeName="height"
                dur={`${2.2 + (index % 4) * 0.35}s`}
                repeatCount="indefinite"
                values={`${22 + (index % 4) * 8};${34 + (index % 4) * 8};${22 + (index % 4) * 8}`}
              />
            </rect>
          ))}
        </g>

        <g className="animate-float-slow">
          <rect x="92" y="78" width="118" height="52" rx="22" fill="#081120" fillOpacity="0.46" />
          <rect x="92" y="78" width="118" height="52" rx="22" fill={`url(#${scoreGradientId})`} />
          <text x="112" y="98" fill="#d7f4ff" fontSize="11" fontWeight="700" letterSpacing="3.2">
            LIVE SCORE
          </text>
          <text x="112" y="118" fill="white" fontSize="24" fontWeight="700">
            118 / 4
          </text>
        </g>

        <g>
          <ellipse cx="260" cy="266" rx="150" ry="44" fill="#03111e" fillOpacity="0.44" />
          <rect x="162" y="138" width="196" height="152" rx="72" fill={`url(#${fieldGradientId})`} />
          <rect x="228" y="150" width="64" height="128" rx="32" fill="#ddac71" fillOpacity="0.9" />
          <path d="M259 156V272" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeDasharray="8 10" />
          <path d="M228 208H292" stroke="white" strokeOpacity="0.3" strokeWidth="3" strokeDasharray="8 10" />
        </g>

        <g opacity="0.95">
          {[0, 9, 18].map((offset) => (
            <rect
              key={`left-stump-${offset}`}
              x={228 + offset}
              y="178"
              width="5"
              height="46"
              rx="2.5"
              fill="#fef3c7"
            />
          ))}
          {[0, 9, 18].map((offset) => (
            <rect
              key={`right-stump-${offset}`}
              x={270 + offset}
              y="178"
              width="5"
              height="46"
              rx="2.5"
              fill="#fef3c7"
            />
          ))}
          <rect x="228" y="174" width="23" height="4" rx="2" fill="#fef3c7" />
          <rect x="270" y="174" width="23" height="4" rx="2" fill="#fef3c7" />
        </g>

        <path
          d="M118 250C176 160 280 120 394 168"
          stroke="#ffffff"
          strokeOpacity="0.26"
          strokeWidth="3"
          strokeDasharray="9 11"
        />
        <path
          d="M134 270C204 156 314 114 430 188"
          stroke="#7fdbff"
          strokeOpacity="0.45"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle r="8" fill="#f97316">
          <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto">
            <mpath href={`#${sceneId}-ball-path`} />
          </animateMotion>
        </circle>
        <circle r="14" fill="#f97316" fillOpacity="0.16">
          <animateMotion dur="4.5s" repeatCount="indefinite">
            <mpath href={`#${sceneId}-ball-path`} />
          </animateMotion>
          <animate attributeName="r" dur="1.8s" repeatCount="indefinite" values="10;16;10" />
        </circle>

        <path
          id={`${sceneId}-ball-path`}
          d="M134 270C204 156 314 114 430 188"
          fill="none"
          stroke="none"
        />

        <g opacity="0.78">
          <circle cx="394" cy="102" r="26" stroke="#d7f4ff" strokeOpacity="0.3" strokeWidth="2">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 394 102"
              to="360 394 102"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="394" cy="102" r="8" fill="#d7f4ff" fillOpacity="0.34" />
        </g>
      </svg>
    </div>
  );
}

export default CricketMotionScene;
