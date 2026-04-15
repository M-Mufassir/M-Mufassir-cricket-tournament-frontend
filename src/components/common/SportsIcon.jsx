function SportsIcon({ icon, className = "h-5 w-5", strokeWidth = 1.8 }) {
  if (icon === "guide") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 5.5 12 3l6 2.5v13L12 21l-6-2.5v-13Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <path
          d="M9.5 9.5h5M9.5 13h5M9.5 16.5h3"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "bat") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="m8 16 6.5-9.5c.9-1.2 2.6-1.5 3.8-.6l.2.1c1.2.9 1.5 2.6.6 3.8L12.6 19"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="m7 17-2.3 2.3c-.7.7-.7 1.7 0 2.4s1.7.7 2.4 0L9.4 19"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "teams") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
        <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
        <path
          d="M3.5 19c.7-2.6 2.8-4 4.5-4s3.8 1.4 4.5 4M12 19c.5-2.1 2.1-3.2 4-3.2 1.5 0 3 .8 4 3.2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "location") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  if (icon === "calendar") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="3" stroke="currentColor" strokeWidth={strokeWidth} />
        <path
          d="M8 3.8v4M16 3.8v4M4 10h16"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "fee") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4v16M8.5 8.5H15a2.5 2.5 0 1 1 0 5H9.5a2.5 2.5 0 1 0 0 5H16"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "trophy") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 4h8v2.5A4 4 0 0 1 12 10.5 4 4 0 0 1 8 6.5V4Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <path
          d="M8 5H5.8A1.8 1.8 0 0 0 4 6.8 3.2 3.2 0 0 0 7.2 10H8m8-5h2.2A1.8 1.8 0 0 1 20 6.8 3.2 3.2 0 0 1 16.8 10H16"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="M12 10.5V15m-3 5h6m-5-5h4"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "stadium") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18c2.4-2.3 4.9-3.5 8-3.5s5.6 1.2 8 3.5M6.5 14V8.5m4 4V6m4 6.5V8m3 6V9.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path d="M3 20h18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "receipt") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3h10a2 2 0 0 1 2 2v15l-2.3-1.5L14 20l-2-1.5L10 20l-2-1.5L5 20V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <path
          d="M9 8.5h6M9 12h6M9 15.5h4"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "shield-check") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3v5.2c0 4.7-2.9 7.6-7 9.8-4.1-2.2-7-5.1-7-9.8V6l7-3Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <path
          d="m9.5 11.9 1.8 1.8 3.7-4"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "camera") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.7l1.4-2h4.8l1.4 2h1.7A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  if (icon === "home") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "chevron-down") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export default SportsIcon;
