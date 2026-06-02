/** File-manager style folder icons for sidebar navigation */

type IconProps = { size?: number; light?: boolean };

const stroke = (light?: boolean) => (light ? "#FFFFFF" : "#5B6CF9");
const fillMain = (light?: boolean) => (light ? "none" : "#EEF0FD");
const fillAccent = (light?: boolean) => (light ? "none" : "#A0A8F5");

export function IconFolder({ open = false, size = 18, light }: IconProps & { open?: boolean }) {
  if (open) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ds-fm-icon">
        <path
          d="M4 8h5l2 2h9v10H4V8z"
          fill={fillAccent(light)}
          stroke={stroke(light)}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M4 8V6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v2"
          fill={fillMain(light)}
          stroke={stroke(light)}
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ds-fm-icon">
      <path
        d="M4 7h6l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V7z"
        fill={fillMain(light)}
        stroke={stroke(light)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFolderFile({ size = 16, light }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ds-fm-icon">
      <path
        d="M8 4h8l2 2v14H6V6l2-2z"
        fill={fillMain(light)}
        stroke={stroke(light)}
        strokeWidth="1.2"
      />
      <path d="M8 4v2h10" stroke={stroke(light)} strokeWidth="1.2" />
    </svg>
  );
}

export function IconArchive({ size = 18, light }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ds-fm-icon">
      <rect x="3" y="4" width="18" height="4" rx="1" fill={fillMain(light)} stroke={stroke(light)} strokeWidth="1.5" />
      <path
        d="M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8"
        fill={fillMain(light)}
        stroke={stroke(light)}
        strokeWidth="1.5"
      />
      <path d="M10 12h4" stroke={stroke(light)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconCalendar({ size = 18, light }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ds-fm-icon">
      <rect x="4" y="5" width="16" height="15" rx="2" fill={fillMain(light)} stroke={stroke(light)} strokeWidth="1.5" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke={stroke(light)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
