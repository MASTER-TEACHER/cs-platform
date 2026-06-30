type BadgeProps = {
  text: string;
};

export default function Badge({
  text,
}: BadgeProps) {
  return (
    <span
      className="
      rounded-full
      bg-blue-100
      px-3
      py-1
      text-xs
      font-semibold
      text-blue-700
      "
    >
      {text}
    </span>
  );
}