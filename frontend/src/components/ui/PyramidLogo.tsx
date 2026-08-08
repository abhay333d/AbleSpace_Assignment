export const PyramidLogo = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3.5 L4 16.5 L9.5 21 L20 18 Z" />
    <path d="M12 3.5 L9.5 21" />
  </svg>
);
