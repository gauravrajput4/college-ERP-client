import React, { useState, useMemo } from "react";
import { Users, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const TeacherWorkloadPanel = ({ timetable }) => {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  const teacherStats = useMemo(() => {
    if (!timetable || !timetable.slots) return [];
    
    const stats = {};
    
    timetable.slots.forEach(slot => {
      if (slot.teacher && !slot.isBreak) {
        const tId = slot.teacher;
        if (!stats[tId]) {
          stats[tId] = {
            id: tId,
            name: slot.teacherName,
            total: 0,
            max: 30, // Default weekly max, should ideally come from backend
            days: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
          };
        }
        stats[tId].total += 1;
        if (stats[tId].days[slot.day] !== undefined) {
          stats[tId].days[slot.day] += 1;
        }
      }
    });
    
    // Sort by workload (highest first)
    return Object.values(stats).sort((a, b) => b.total - a.total);
  }, [timetable]);

  if (teacherStats.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 z-10">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-500" />
          Teacher Workload
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          {teacherStats.length} teachers
        </span>
      </div>

      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
        {teacherStats.map((teacher) => {
          const isExpanded = expandedTeacher === teacher.id;
          const percentage = (teacher.total / teacher.max) * 100;
          
          let statusColor = "bg-green-500";
          let bgLight = "bg-green-50";
          let isOverloaded = false;
          
          if (percentage > 90) {
            statusColor = "bg-red-500";
            bgLight = "bg-red-50";
            isOverloaded = true;
          } else if (percentage > 70) {
            statusColor = "bg-amber-500";
            bgLight = "bg-amber-50";
          }

          return (
            <div key={teacher.id} className="mb-2 border border-gray-100 rounded-lg overflow-hidden transition-all">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${isExpanded ? 'bg-gray-50' : ''}`}
                onClick={() => setExpandedTeacher(isExpanded ? null : teacher.id)}
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center">
                      {isOverloaded && <AlertTriangle className="w-3.5 h-3.5 text-red-500 mr-1" />}
                      {teacher.name}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {teacher.total}/{teacher.max}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusColor} transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className={`p-3 border-t border-gray-100 ${bgLight} text-sm`}>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(teacher.days).filter(([_, count]) => count > 0).map(([day, count]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{day}</span>
                        <div className="flex items-center space-x-1">
                          {/* Mini visual bars for the day */}
                          <div className="flex space-x-0.5">
                            {[...Array(count)].map((_, i) => (
                              <div key={i} className={`w-2 h-3 rounded-sm ${statusColor} opacity-80`} />
                            ))}
                          </div>
                          <span className="text-gray-900 font-bold ml-2">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isOverloaded && (
                    <p className="text-xs text-red-600 mt-3 font-medium flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Teacher is exceeding recommended weekly periods
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherWorkloadPanel;
