// Temporary icons component until lucide-react is installed
export const Package = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>📦</div>
);

export const Users = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>👥</div>
);

export const TrendingUp = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>📈</div>
);

export const TrendingDown = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>📉</div>
);

export const ShoppingCart = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>🛒</div>
);

export const AlertCircle = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>⚠️</div>
);

export const RefreshCw = ({ className }: { className?: string }) => (
  <div className={`${className} inline-block`}>🔄</div>
);

export const Star = ({
  className,
  filled = true,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 .587l3.668 7.431L23.4 9.748l-5.6 5.455L19.335 24 12 19.897 4.665 24l1.535-8.797L.6 9.748l7.732-1.73L12 .587z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);
