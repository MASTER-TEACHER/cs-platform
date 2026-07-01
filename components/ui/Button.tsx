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
      px-6
      py-4
      text-lg
      font-semibold
      text-white
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:bg-red-700
      hover:shadow-lg
      active:scale-95
      "
    >
      {children}
    </button>
  );
}