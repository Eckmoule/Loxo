function Icon({ name, size = 16, color = 'currentColor', className = '' }) {
  const icons = {
    // Auth icons
    eye: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke={color} strokeWidth="1.3" />
        <circle cx="8" cy="8" r="1.8" fill={color} />
      </svg>
    ),
    eyeOff: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke={color} strokeWidth="1.3" />
        <circle cx="8" cy="8" r="1.8" fill={color} />
        <path d="M3 3l10 10" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    spinner: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" />
      </svg>
    ),
    logo: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
        <path d="M18 7L7 7L7 18" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 33L33 33L33 22" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="30" x2="30" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" strokeOpacity="0.45" />
        <circle cx="30" cy="10" r="2.8" fill={color} />
      </svg>
    ),

    // Status icons
    check: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <path d="M6 14l6 6 10-10" stroke="var(--positive)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
        <path d="M14 9v5M14 18v.5" stroke="var(--negative)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="14" cy="14" r="10" stroke="var(--negative)" strokeWidth="2" />
      </svg>
    ),

    // Nav & Menu icons
    menu: (
      <svg width={size} height={size} viewBox="0 0 15 15" fill="none" className={className}>
        <path d="M2 4h11M2 7.5h11M2 11h11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1.06 1.06M11.84 11.84l1.06 1.06M3.1 12.9l1.06-1.06M11.84 4.16l1.06-1.06" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2.8" stroke={color} strokeWidth="1.4" />
      </svg>
    ),
    moon: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5 5.5 5.5 0 1013.5 9.5z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <circle cx="7" cy="5" r="2.5" stroke={color} strokeWidth="1.3" />
        <path d="M1.5 12.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),

    // Search & Location icons
    search: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.5" />
        <path d="M11 11l2.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    mapPin: (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
        <circle cx="6" cy="5" r="2.5" stroke={color} strokeWidth="1.3" />
        <path d="M6 10c0 0-4-3.5-4-5a4 4 0 018 0c0 1.5-4 5-4 5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),

    // Contact & Menu item icons
    mail: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <rect x="1" y="3" width="12" height="8.5" rx="1.5" stroke={color} strokeWidth="1.3" />
        <path d="M1 4.5l6 4 6-4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.3" />
        <path d="M7 6.5v3.5M7 4.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    document: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <rect x="2" y="1" width="10" height="12" rx="1.5" stroke={color} strokeWidth="1.3" />
        <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    send: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <path d="M1 7l12-5-5 12-2-4.5L1 7z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M15 8.18A7 7 0 11 8.18 1 7 7 0 0115 8.18z" stroke={color} strokeWidth="1.2" />
        <path d="M8 1v14M1 8h14" stroke={color} strokeWidth="1.2" />
        <path d="M2 5.5Q5 7 8 7t6-1.5M2 10.5Q5 9 8 9t6 1.5" stroke={color} strokeWidth="1.2" />
      </svg>
    ),
    arrowDown: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
        <path d="M3 5l4 4 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default Icon;