type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const theme = {
  radius: {
    lg: "rounded-lg",
  },
  border: "border",
  colors: {
    surface: "bg-white",
  },
  spacing: {
    card: "p-4",
  },
  shadow: {
    card: "shadow-sm",
  },
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        ${theme.radius.lg}
        ${theme.border}
        ${theme.colors.surface}
        ${theme.spacing.card}
        ${theme.shadow.card}
        transition-all
        duration-300
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}