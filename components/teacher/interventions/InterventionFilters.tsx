type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
};
export default function InterventionFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
}: Props) {
  return (
    <div className="grid gap-4 rounded-3xl border bg-white p-5 md:grid-cols-[1fr_220px]">
      <label>
        <span className="text-sm font-bold">Search</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
          placeholder="Student, class or topic"
        />
      </label>
      <label>
        <span className="text-sm font-bold">Priority</span>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
    </div>
  );
}
