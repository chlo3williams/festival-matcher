import { useState } from "react";
import Papa from "papaparse";

import { FestivalLineup } from "@/types/festival";
import glastonbury2025Data from "../data/glastonbury2025.json";
import tramlines2025Data from "../data/tramlines2025.json";

type Props = {
  onLineupParsed: (lineup: FestivalLineup[]) => void;
};

const glastonbury2025: FestivalLineup[] = glastonbury2025Data.lineup;
const tramlines2025: FestivalLineup[] = tramlines2025Data.lineup;

const presetLineups: Record<string, FestivalLineup[]> = {
  "Glastonbury 2025": glastonbury2025,
  "Tramlines 2025": tramlines2025,
};

export default function FestivalInput({ onLineupParsed }: Props) {
  const [selectedFestival, setSelectedFestival] = useState<string>("");

  const handlePresetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const festival = event.target.value;
    setSelectedFestival(festival);

    const preset = presetLineups[festival];

    if (preset) {
      onLineupParsed([...preset]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isCSV = file.name.endsWith(".csv");

    reader.onload = () => {
      const text = reader.result as string;

      if (isCSV) {
        Papa.parse<FestivalLineup>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            onLineupParsed(results.data);
          },
        });
      } else {
        try {
          const parsed = JSON.parse(text);
          onLineupParsed(parsed.lineup || parsed);
        } catch (error) {
          alert("Invalid JSON format");
        }
      }
    };
    reader.readAsText(file);
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
