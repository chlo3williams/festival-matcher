import orderDays from "@/helpers/orderDays";

type Props = {
  days: string[];
  selectedDay: string;
  onChange: (day: string) => void;
};

export default function DayFilter({ days, selectedDay, onChange }: Props) {
  const sortedDays = orderDays(days);

  return (
    <select
      className="p-2 border rounded text-sm"
      value={selectedDay}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Days</option>
      {sortedDays.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
  );
}
