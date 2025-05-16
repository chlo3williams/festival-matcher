import { useEffect } from "react";

import { usePersistentState } from "@/hooks/usePersistentState";
import { FestivalLineup } from "@/types/festival";
import glastonbury2025Data from "../data/glastonbury2025.json";
import tramlines2025Data from "../data/tramlines2025.json";

type Props = {
  onLineupParsed: (lineup: FestivalLineup[]) => void;
  selectedFestival: string;
  setSelectedFestival: (festival: string) => void;
};

const glastonbury2025: FestivalLineup[] = glastonbury2025Data.lineup;
const tramlines2025: FestivalLineup[] = tramlines2025Data.lineup;

const presetLineups: Record<string, FestivalLineup[]> = {
  "Glastonbury 2025": glastonbury2025,
  "Tramlines 2025": tramlines2025,
};

export default function FestivalInput({ onLineupParsed, selectedFestival, setSelectedFestival }: Props) {

  useEffect(() => {
    if (selectedFestival && presetLineups[selectedFestival]) {
      onLineupParsed([...presetLineups[selectedFestival]]);
    }
  }, [selectedFestival]);

  const handlePresetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const festival = event.target.value;
    setSelectedFestival(festival);

    const preset = presetLineups[festival];

    if (preset) {
      onLineupParsed([...preset]);
    }
  };

  return (
    <div className="text-center">
      <label className="block">
        Choose a festival:
        <select className="border-1 m-4 rounded" value={selectedFestival} onChange={handlePresetSelect}>
          <option value="">--Select a Festival --</option>
          {Object.keys(presetLineups).map((festival) => (
            <option key={festival} value={festival}>
              {festival}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
