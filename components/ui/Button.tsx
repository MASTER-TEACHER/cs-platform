type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
      w-full
      rounded-xl
      bg-blue-600
      px-5
      py-3
      font-semibold
      text-white
      transition
      hover:bg-blue-700
      active:scale-95
      "
    >
      {children}
    </button>
  );
}