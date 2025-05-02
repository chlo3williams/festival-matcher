import { useState } from "react";
import { FestivalLineup } from "@/types/festival";
import orderDays from "@/helpers/orderDays";

type ScheduleModalProps = {
  schedule: FestivalLineup[];
  onClose: () => void;
  onRemoveFromSchedule: (artist: FestivalLineup) => void;
};

export default function ScheduleModal({ schedule, onClose, onRemoveFromSchedule }: ScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState("");
  const allDays = orderDays([...new Set(schedule.map((item) => item.day))]);

  const filteredSchedule = selectedDay ? schedule.filter((item) => item.day === selectedDay) : schedule;

  const sortedScheduleByDay: [string, FestivalLineup[]][] = orderDays([
    ...new Set(filteredSchedule.map((item) => item.day)),
  ]).map((day) => [day, filteredSchedule.filter((item) => item.day === day)]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100/70 via-yellow-100/70 to-blue-100/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold hover:text-red-500">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">My Festival Schedule</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by day:</label>
          <select
            className="p-2 border rounded text-sm w-full"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="">All Days</option>
            {allDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {schedule.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven’t added any artists to your schedule yet. <br />
            Click the <span className="font-bold">+</span> on any artist to start planning your festival!
          </p>
        ) : (
          sortedScheduleByDay.map(([day, items]) => (
            <div key={day} className="mb-6">
              <h3 className="mb-2 pb-1">{day}</h3>
              <ul className="space-y-1 ml-2">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      <strong>{item.artist}</strong>
                      {item.stage && ` — ${item.stage}`}
                    </span>
                    <button
                      onClick={() => onRemoveFromSchedule(item)}
                      className="text-xs text-red-600 hover:underline ml-4"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
