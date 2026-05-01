import React from "react";
import { RefreshCw, FileText, Save, Send, AlertTriangle, CheckCircle2 } from "lucide-react";

const TimetableActionBar = ({ 
  conflicts = [], 
  assignedCount = 0, 
  totalCount = 0, 
  onRegenerate, 
  onSaveDraft, 
  onPublish,
  isSaving
}) => {
  const hasConflicts = conflicts.length > 0;
  const isComplete = assignedCount === totalCount && totalCount > 0 && !hasConflicts;

  return (
    <div className="sticky bottom-4 z-40 bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto">
      
      {/* Status Info */}
      <div className="flex items-center space-x-6 px-2">
        {hasConflicts ? (
          <div className="flex items-center text-amber-400">
            <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
            <span className="font-semibold">{conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-semibold">No conflicts</span>
          </div>
        )}
        
        <div className="h-6 w-px bg-gray-700 hidden md:block"></div>

        <div className="flex items-center text-gray-300 text-sm font-medium">
          <span className={assignedCount < totalCount ? "text-amber-300" : "text-emerald-400"}>
            {assignedCount}/{totalCount} slots assigned
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRegenerate}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium transition-colors border border-gray-700 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </button>

        <button
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium transition-colors border border-gray-700 disabled:opacity-50"
          onClick={() => {
            // Future implementation for PDF
            window.print();
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Preview PDF
        </button>

        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="flex items-center px-5 py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={onPublish}
          disabled={hasConflicts || isSaving || assignedCount < totalCount}
          title={hasConflicts ? "Resolve conflicts before publishing" : "Publish to students and faculty"}
          className="flex items-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 mr-2" />
          Publish
        </button>
      </div>
    </div>
  );
};

export default TimetableActionBar;
