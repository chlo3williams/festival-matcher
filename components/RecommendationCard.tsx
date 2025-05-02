import { FestivalLineup } from "@/types/festival";

type Props = {
  artist: string;
  day: string;
  reason: string;
  onAddToSchedule: (artist: FestivalLineup) => void;
};

export default function RecommendationCard({ artist, day, reason, onAddToSchedule }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-sm">
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-lg font-semibold">{artist}</h4>
        <button
          onClick={() => onAddToSchedule({ artist, day, stage: "" })}
          className="text-sm font-bold bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded-full"
        >
          +
        </button>
      </div>
      <p className="text-gray-700 mb-1">{day}</p>
      <p className="text-gray-600 text-sm">{reason}</p>
    </div>
  );
}
