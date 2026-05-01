import React from "react";
import { AlertTriangle, MoveDown, MoveUp } from "lucide-react";

const SmartExamPreviewTable = ({ schedule = [], onMoveUp, onMoveDown, conflicts = [] }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            {["Order", "Subject", "Code", "Date", "Time", "Duration", "Room Allocations"].map((label) => (
              <th key={label} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {schedule.map((slot, index) => {
            const hasConflict = conflicts.some(
              c => c.subject === slot.subject || (c.date === slot.date && c.subject !== slot.subject)
            );

            return (
              <tr key={index} className={hasConflict ? "bg-red-50" : (index % 2 ? "bg-slate-50" : "bg-white")}>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500 w-4">{index + 1}</span>
                    <div className="flex flex-col gap-1">
                      <button 
                        type="button" 
                        onClick={() => onMoveUp && onMoveUp(index)} 
                        disabled={index === 0}
                        className="rounded hover:bg-slate-200 p-0.5 disabled:opacity-30"
                      >
                        <MoveUp size={14} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onMoveDown && onMoveDown(index)} 
                        disabled={index === schedule.length - 1}
                        className="rounded hover:bg-slate-200 p-0.5 disabled:opacity-30"
                      >
                        <MoveDown size={14} />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {slot.subjectName}
                    {hasConflict && <AlertTriangle className="text-red-500" size={14} title="Conflict detected" />}
                  </div>
                </td>
                <td className="px-3 py-3">{slot.subjectCode}</td>
                <td className="px-3 py-3 font-semibold text-indigo-700">
                  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(slot.date))}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {slot.startTime} - {slot.endTime}
                </td>
                <td className="px-3 py-3 font-semibold">{slot.duration}</td>
                <td className="px-3 py-3">
                  {slot.rooms && slot.rooms.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {slot.rooms.map((room, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          {room.roomId} ({room.allocatedStudents})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-red-500 text-xs">No rooms</span>
                  )}
                </td>
              </tr>
            );
          })}
          {!schedule.length ? (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                Generate schedule to see preview.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default SmartExamPreviewTable;
