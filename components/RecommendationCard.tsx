type Props = {
  artist: string;
  day: string;
  reason: string;
};

export default function RecommendationCard({ artist, day, reason }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-sm">
      <h4 className="text-lg font-semibold">{artist}</h4>
      <p className="text-gray-700 mb-1">{day}</p>
      <p className="text-gray-600 text-sm">{reason}</p>
    </div>
  );
}
