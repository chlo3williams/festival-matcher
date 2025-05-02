import { FestivalLineup } from "@/types/festival";

type Props = FestivalLineup & {
  artist: string;
  day: string;
  stage: string;
  onAddToSchedule: (artist: FestivalLineup) => void;
};

export default function MatchCard({ artist, day, stage, onAddToSchedule }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-sm">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-semibold mr-2">{artist}</h4>
        <button
          onClick={() => onAddToSchedule({ artist, day, stage })}
          className="text-sm font-bold bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded-full"
        >
          +
        </button>
      </div>
      <p className="text-gray-600">
        {day} — {stage}
      </p>
    </div>
  );
}
