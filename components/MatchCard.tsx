type Props = {
  artist: string;
  day: string;
  stage: string;
}

export default function MatchCard({ artist, day, stage }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-sm">
      <h4 className="text-lg font-semibold">{artist}</h4>
      <p className="text-gray-600">{day} — {stage}</p>
    </div>
  );
}
