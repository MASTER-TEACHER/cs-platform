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
bg-slate-900
px-6
py-4
text-lg
font-semibold
text-white
transition-all
duration-300
hover:bg-slate-800
hover:shadow-lg
active:scale-95
"
    >
      {children}
    </button>
  );
}