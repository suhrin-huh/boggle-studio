export default function QrCodeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="2.5" height="2.5" />
      <rect x="17.5" y="14" width="2.5" height="2.5" />
      <rect x="14" y="17.5" width="2.5" height="2.5" />
      <rect x="17.5" y="17.5" width="2.5" height="2.5" />
    </svg>
  );
}
