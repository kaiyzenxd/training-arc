export function Chevron({
  dir = "right",
  size = 8,
}: {
  dir?: "left" | "right";
  size?: number;
}) {
  return (
    <svg
      className={`chevron ${dir === "left" ? "chevron--left" : ""}`}
      width={size}
      height={size * 1.4}
      viewBox="0 0 8 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5 6 5.5 1.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
