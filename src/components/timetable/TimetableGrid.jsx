import React, { useMemo } from "react";
import { Coffee, AlertTriangle, User, Edit2, Plus } from "lucide-react";

// Color palette for subjects based on request
const SUBJECT_COLORS = [
  { bg: '#EEF2FF', border: '#6366F1', text: '#4338CA' }, // indigo
  { bg: '#F0FDF4', border: '#22C55E', text: '#15803D' }, // green
  { bg: '#FFF7ED', border: '#F97316', text: '#C2410C' }, // orange
  { bg: '#FDF4FF', border: '#A855F7', text: '#7E22CE' }, // purple
  { bg: '#F0F9FF', border: '#38BDF8', text: '#0369A1' }, // sky
  { bg: '#FFF1F2', border: '#FB7185', text: '#BE123C' }, // rose
  { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E' }, // amber
  { bg: '#F0FDFA', border: '#2DD4BF', text: '#0F766E' }, // teal
];

const TimetableGrid = ({ timetable, conflicts = [], onCellClick, isEditable = false }) => {
  if (!timetable || !timetable.slots) return null;

  const slots = timetable.slots;

  // Derive unique days and time slots (periods/breaks) from the data
  const days = useMemo(() => {
    const uniqueDays = [...new Set(slots.map(s => s.day))];
    // Sort logic if needed, assuming they come in correct order from backend (Mon-Sat)
    return uniqueDays;
  }, [slots]);

  const timeRows = useMemo(() => {
    // Group slots by startTime to create rows
    const rowsMap = new Map();
    slots.forEach(slot => {
      const key = `${slot.startTime}-${slot.endTime}`;
      if (!rowsMap.has(key)) {
        rowsMap.set(key, {
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBreak: slot.isBreak,
          breakLabel: slot.breakLabel,
          periodNumber: slot.periodNumber,
          slotsByDay: {}
        });
      }
      rowsMap.get(key).slotsByDay[slot.day] = slot;
    });

    // Sort by startTime (assuming HH:MM format)
    return Array.from(rowsMap.values()).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots]);

  // Map subjects to consistent colors
  const subjectColorMap = useMemo(() => {
    const map = {};
    let colorIndex = 0;
    slots.forEach(slot => {
      if (slot.subject && !map[slot.subject]) {
        map[slot.subject] = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
        colorIndex++;
      }
    });
    return map;
  }, [slots]);

  const getSlotConflict = (slot) => {
    return conflicts.find(c => c.day === slot.day && c.startTime === slot.startTime);
  };

  return (
    <div className="w-full overflow-x-auto relative shadow-inner rounded-xl bg-white">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-20 shadow-sm">
          <div className="w-24 md:w-32 flex-shrink-0 border-r border-gray-200 p-4 font-semibold text-gray-500 text-xs text-center sticky left-0 bg-gray-50 z-30 uppercase tracking-wider">
            Time
          </div>
          {days.map(day => (
            <div key={day} className="w-40 md:w-48 flex-shrink-0 border-r border-gray-200 p-4 font-bold text-gray-800 text-center uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        <div className="flex flex-col relative z-0">
          {timeRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex border-b border-gray-100 group">
              {/* Time Column (Sticky) */}
              <div className="w-24 md:w-32 flex-shrink-0 border-r border-gray-200 p-2 md:p-3 bg-white flex flex-col justify-center items-center sticky left-0 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                <span className="text-sm font-bold text-gray-700">{row.startTime}</span>
                <span className="text-xs text-gray-400 my-0.5">to</span>
                <span className="text-sm font-medium text-gray-500">{row.endTime}</span>
              </div>

              {/* Break Row (Spans all columns) */}
              {row.isBreak ? (
                <div 
                  className="flex-1 flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50 border-r border-gray-200 text-amber-800 p-3"
                  style={{ minWidth: `${days.length * 10}rem` }}
                >
                  <Coffee className="w-5 h-5 mr-2 text-amber-600" />
                  <span className="font-semibold">{row.breakLabel || "Break"}</span>
                </div>
              ) : (
                /* Regular Period Row */
                days.map(day => {
                  const slot = row.slotsByDay[day];
                  if (!slot) return <div key={day} className="w-40 md:w-48 flex-shrink-0 border-r border-gray-100 bg-gray-50/30 p-2"></div>;

                  const conflict = getSlotConflict(slot);
                  const isConflict = slot.isConflict || conflict;
                  const isUnassigned = !slot.subject;

                  let cellClass = "h-full w-full rounded-lg p-2 md:p-3 relative flex flex-col justify-between transition-all duration-200 ";
                  let style = {};

                  if (isConflict) {
                    cellClass += "bg-red-50 border-2 border-red-300 animate-[pulse_2s_ease-in-out_infinite]";
                  } else if (isUnassigned) {
                    cellClass += "bg-amber-50/50 border-2 border-dashed border-amber-300 hover:bg-amber-50 cursor-pointer";
                  } else {
                    const colors = subjectColorMap[slot.subject] || SUBJECT_COLORS[0];
                    cellClass += "border shadow-sm group-hover/cell:shadow-md group-hover/cell:scale-[1.02] cursor-pointer";
                    style = { backgroundColor: colors.bg, borderColor: colors.border };
                  }

                  return (
                    <div key={day} className="w-40 md:w-48 flex-shrink-0 border-r border-gray-100 p-1.5 md:p-2 bg-white">
                      <div 
                        className={`group/cell ${cellClass}`}
                        style={style}
                        onClick={() => isEditable && onCellClick && onCellClick(slot)}
                      >
                        {/* Edit Icon Overlay */}
                        {isEditable && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover/cell:opacity-100 transition-opacity bg-white/80 p-1 rounded backdrop-blur-sm z-10">
                            <Edit2 className="w-3 h-3 text-gray-700" />
                          </div>
                        )}

                        {isConflict ? (
                          <>
                            <div className="absolute -top-2 -right-2 bg-red-100 border border-red-200 rounded-full p-1 z-20" title={conflict?.message || "Conflict"}>
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                              {isUnassigned ? (
                                <>
                                  <span className="text-red-700 font-medium text-sm mb-1">Unassigned</span>
                                  <span className="text-red-500 text-xs">No teacher available</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-red-800 font-bold text-sm truncate w-full">{slot.subjectName}</span>
                                  <span className="text-red-600 font-medium text-xs truncate w-full mt-1">Conflict detected</span>
                                </>
                              )}
                            </div>
                          </>
                        ) : isUnassigned ? (
                          <div className="flex-1 flex flex-col justify-center items-center text-center text-amber-600">
                            <Plus className="w-5 h-5 mb-1 opacity-70" />
                            <span className="text-sm font-medium">Click to assign</span>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="font-bold text-sm leading-tight mb-0.5 line-clamp-2" style={{ color: subjectColorMap[slot.subject]?.text }}>
                                {slot.subjectName}
                              </div>
                              <div className="text-[10px] font-semibold opacity-70" style={{ color: subjectColorMap[slot.subject]?.text }}>
                                {slot.subjectCode}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center bg-white/60 rounded px-1.5 py-1 w-fit">
                              <User className="w-3 h-3 mr-1 opacity-70 text-gray-700" />
                              <span className="text-[11px] font-medium text-gray-800 truncate max-w-[100px]">
                                {slot.teacherName.split(' ')[0]} {/* Show first name mostly to save space */}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
        <span className="mr-2 text-gray-500">LEGEND:</span>
        {Object.values(subjectColorMap).slice(0, 5).map((color, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: color.bg, borderColor: color.border, borderWidth: '1px' }}></div>
            Subject {i+1}
          </div>
        ))}
        {Object.values(subjectColorMap).length > 5 && <span>...</span>}
        <div className="h-4 w-px bg-gray-300 mx-2"></div>
        <div className="flex items-center">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mr-1.5" /> Conflict
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border border-dashed border-amber-400 bg-amber-50 mr-1.5"></div> Unassigned
        </div>
        <div className="flex items-center">
          <Coffee className="w-3.5 h-3.5 text-amber-600 mr-1.5" /> Break
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
