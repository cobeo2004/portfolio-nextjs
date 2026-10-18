import clsx from "clsx";

// The SN monogram on a cobalt tile. The same geometry is used for src/app/icon.svg.
export default function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={clsx("mark", className)}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <rect className="mk-bg" width="32" height="32" />
      <g className="mk-l">
        <rect x="4.5" y="7" width="10.5" height="3.6" />
        <rect x="4.5" y="7" width="3.6" height="10.8" />
        <rect x="4.5" y="14.2" width="10.5" height="3.6" />
        <rect x="11.4" y="14.2" width="3.6" height="10.8" />
        <rect x="4.5" y="21.4" width="10.5" height="3.6" />
        <rect x="17" y="7" width="3.6" height="18" />
        <rect x="23.9" y="7" width="3.6" height="18" />
        <polygon points="17,7 20.6,7 27.5,25 23.9,25" />
      </g>
    </svg>
  );
}
