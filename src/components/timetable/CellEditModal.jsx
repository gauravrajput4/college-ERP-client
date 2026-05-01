import React, { useState, useEffect } from "react";
import { X, UserCheck, UserX, AlertCircle, Search, MapPin, CheckCircle } from "lucide-react";
import { useAvailableTeachers } from "../../hooks/queries/useTimetable.js";

const CellEditModal = ({ slot, formData, onSave, onClose }) => {
  const [selectedSubject, setSelectedSubject] = useState(slot?.subject || "");
  const [selectedTeacher, setSelectedTeacher] = useState(slot?.teacher || "");
  const [room, setRoom] = useState(slot?.room || "");
  const [searchTerm, setSearchTerm] = useState("");

  const isUnassigned = !slot?.subject;

  // Make sure we have the configured subjects available
  const availableSubjects = formData?.subjects || [];

  // Fetch available teachers for the selected subject and current slot
  const { data: teachers = [], isLoading } = useAvailableTeachers({
    day: slot?.day,
    startTime: slot?.startTime,
    endTime: slot?.endTime,
    subjectId: selectedSubject,
  });

  // Filter teachers by search term
  const filteredTeachers = teachers.filter(t => 
    t.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedSubject) return; // Basic validation
    
    const subjectInfo = availableSubjects.find(s => s.subjectId === selectedSubject);
    const teacherInfo = teachers.find(t => t.teacherId === selectedTeacher);
    
    onSave({
      ...slot,
      subject: selectedSubject,
      subjectName: subjectInfo?.subjectName || slot?.subjectName,
      subjectCode: subjectInfo?.subjectCode || slot?.subjectCode,
      teacher: selectedTeacher || null,
      teacherName: teacherInfo?.teacherName || "",
      room: room,
      isConflict: false // Clear conflict on manual save, will be re-evaluated
    });
  };

  if (!slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Edit2Icon className="w-4 h-4 mr-2 text-indigo-500" />
              Edit Slot
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {slot.day}, P-{slot.periodNumber} ({slot.startTime} → {slot.endTime})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTeacher(""); // Reset teacher when subject changes
              }}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium"
            >
              <option value="" disabled>Select a subject</option>
              {availableSubjects.map((sub) => (
                <option key={sub.subjectId} value={sub.subjectId}>
                  {sub.subjectName} ({sub.subjectCode})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Selection */}
          {selectedSubject && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-end">
                <span>Available Teachers</span>
                <span className="text-xs font-normal text-gray-500">{teachers.length} found</span>
              </label>
              
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <UserX className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">No teachers available</p>
                    <p className="text-xs mt-1">Try a different subject or slot</p>
                  </div>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const isSelected = selectedTeacher === teacher.teacherId;
                    const isDisabled = teacher.isBooked;
                    
                    return (
                      <div 
                        key={teacher.teacherId}
                        onClick={() => !isDisabled && setSelectedTeacher(teacher.teacherId)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between
                          ${isDisabled 
                            ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed" 
                            : isSelected
                            ? "bg-indigo-50 border-indigo-500 cursor-pointer shadow-sm"
                            : "bg-white border-gray-200 hover:border-indigo-300 cursor-pointer"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {teacher.teacherName.charAt(0)}
                          </div>
                          
                          <div>
                            <p className={`text-sm font-bold ${isDisabled ? 'text-gray-600' : 'text-gray-900'}`}>
                              {teacher.teacherName}
                            </p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                                ${teacher.currentPeriodsToday >= teacher.maxPeriodsPerDay 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-green-100 text-green-700"}
                              `}>
                                {teacher.currentPeriodsToday}/{teacher.maxPeriodsPerDay} periods today
                              </span>
                              
                              <span className={`text-[10px] font-medium flex items-center
                                ${teacher.preferenceLevel === 'preferred' ? 'text-amber-600' : 'text-gray-500'}
                              `}>
                                {teacher.preferenceLevel === 'preferred' && "⭐ "}
                                {teacher.preferenceLevel === 'preferred' ? 'Preferred' : 'Capable'}
                              </span>
                            </div>
                            
                            {isDisabled && (
                              <p className="text-xs text-red-600 mt-1 flex items-center font-medium">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Booked in another class
                              </p>
                            )}
                          </div>
                        </div>

                        {!isDisabled && (
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                            ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}
                          `}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              Room (Optional)
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Hall A - Room 101"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedSubject || !selectedTeacher}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const Edit2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

export default CellEditModal;
