import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Play, RefreshCw, XCircle } from "lucide-react";
import TimetableGrid from "../TimetableGrid.jsx";
import TimetableActionBar from "../TimetableActionBar.jsx";

const Step3GeneratePreview = ({ 
  formData, 
  timetable, 
  conflicts, 
  onGenerate, 
  onSave, 
  onRegenerate, 
  isGenerating, 
  isSaving,
  onCellClick,
  onPrev
}) => {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  // Animation effect when generating
  useEffect(() => {
    if (isGenerating) {
      setProgress(10);
      setProgressText("Calculating time slots...");
      
      const timer1 = setTimeout(() => {
        setProgress(40);
        setProgressText("Loading teacher availability...");
      }, 600);
      
      const timer2 = setTimeout(() => {
        setProgress(70);
        setProgressText("Assigning teachers using greedy algorithm...");
      }, 1200);
      
      const timer3 = setTimeout(() => {
        setProgress(90);
        setProgressText("Detecting conflicts...");
      }, 1800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (timetable) {
      setProgress(100);
    }
  }, [isGenerating, timetable]);

  // STATE B: Generating
  if (isGenerating) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-24 h-24 mb-8">
          <svg className="animate-spin w-full h-full text-gray-200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" />
          </svg>
          <svg className="absolute top-0 left-0 w-full h-full text-indigo-600 drop-shadow-md" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} className="transition-all duration-300 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-600">{progress}%</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Timetable...</h3>
        <p className="text-gray-500 animate-pulse">{progressText}</p>

        <div className="w-full max-w-md mt-8 space-y-3">
          <div className={`flex items-center text-sm ${progress >= 40 ? 'text-green-600' : 'text-gray-400'}`}>
            {progress >= 40 ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2" />}
            Time slots calculated
          </div>
          <div className={`flex items-center text-sm ${progress >= 70 ? 'text-green-600' : 'text-gray-400'}`}>
            {progress >= 70 ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2" />}
            Teacher availability loaded
          </div>
          <div className={`flex items-center text-sm ${progress >= 90 ? 'text-green-600' : 'text-gray-400'}`}>
            {progress >= 90 ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2" />}
            Assigning teachers to subjects
          </div>
        </div>
      </div>
    );
  }

  // STATE A: Ready to Generate (before generation happens)
  if (!timetable && !isGenerating) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Class Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Class</span>
                <span className="font-medium">{formData.classId ? "Selected Class" : ""} - Sec {formData.section}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Semester</span>
                <span className="font-medium">{formData.semester}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-600">Subjects</span>
                <span className="font-medium">{formData.subjects?.length} configured</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Schedule Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Days</span>
                <span className="font-medium">{formData.workingDays?.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Timing</span>
                <span className="font-medium">{formData.startTime} → {formData.endTime}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-600">Lecture Duration</span>
                <span className="font-medium">{formData.lectureDuration} mins</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-xl text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Play className="w-8 h-8 text-indigo-600 ml-1" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Generate</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            The AI engine will assign teachers based on availability, subject preferences, and workload constraints.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onPrev}
              className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => onGenerate(formData)}
              className="px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium shadow-md shadow-indigo-200 transition-colors flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate Timetable
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE C & D: Generated Timetable (with or without conflicts)
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Conflicts Banner */}
      {conflicts && conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Generated with {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-red-600 mt-1 mb-4">
                Some slots could not be filled automatically or violated constraints. Please resolve them manually.
              </p>
              
              <div className="space-y-2">
                {conflicts.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex items-center bg-white p-3 rounded-lg border border-red-100 text-sm">
                    {c.type === 'unassigned_slot' || c.type === 'no_teacher_available' ? (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                    )}
                    <span className="font-medium text-gray-900 mr-2">{c.day} P-{c.period}:</span>
                    <span className="text-gray-600">{c.message}</span>
                  </div>
                ))}
                {conflicts.length > 3 && (
                  <div className="text-sm text-red-600 font-medium pl-2">
                    + {conflicts.length - 3} more conflicts in the grid
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TimetableGrid 
          timetable={timetable} 
          conflicts={conflicts} 
          onCellClick={onCellClick}
          isEditable={true}
        />
      </div>

      {/* Action Bar (Sticky at bottom) */}
      <TimetableActionBar 
        conflicts={conflicts}
        assignedCount={timetable.stats?.assignedSlots}
        totalCount={timetable.stats?.totalRegularSlots}
        onRegenerate={() => onRegenerate(formData)}
        onSaveDraft={() => onSave("draft")}
        onPublish={() => onSave("published")}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Step3GeneratePreview;
