type BadgeProps = {
  children: React.ReactNode;
};

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span className="
      inline-flex
      items-center
      rounded-full
      bg-blue-100
      px-3
      py-1
      text-sm
      font-semibold
      text-blue-700
    ">
      {children}
    </span>
  );
}