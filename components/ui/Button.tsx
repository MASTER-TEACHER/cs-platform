type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200",
    success:
      "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl px-6 py-4 text-base font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}