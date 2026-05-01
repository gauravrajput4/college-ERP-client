import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/timetable/steps/StepIndicator.jsx";
import Step1SelectClass from "../../components/timetable/steps/Step1SelectClass.jsx";
import Step2ConfigureSchedule from "../../components/timetable/steps/Step2ConfigureSchedule.jsx";
import Step3GeneratePreview from "../../components/timetable/steps/Step3GeneratePreview.jsx";
import TeacherWorkloadPanel from "../../components/timetable/TeacherWorkloadPanel.jsx";
import CellEditModal from "../../components/timetable/CellEditModal.jsx";
import { useGenerateTimetable, useSaveTimetable, useUpdateSlot, useClasses } from "../../hooks/queries/useTimetable.js";
import { toast } from "react-hot-toast";

const CreateTimetablePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [timetable, setTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState(null);
  
  // Modal state
  const [editingSlot, setEditingSlot] = useState(null);

  const { mutate: generateTimetable, isPending: isGenerating } = useGenerateTimetable();
  const { mutate: saveTimetable, isPending: isSaving } = useSaveTimetable();
  const { data: classesData } = useClasses();

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (timetable && !isSaved) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [timetable, isSaved]);

  // Auto-save logic
  useEffect(() => {
    if (timetable && !isSaved && !isGenerating && !isSaving && !timetable._id) {
      const timer = setTimeout(() => {
        handleSave("draft", true);
      }, 120000); // Auto save every 2 mins
      return () => clearTimeout(timer);
    }
  }, [timetable, isSaved, isGenerating, isSaving]);

  const steps = [
    {
      number: 1,
      label: "Select Class",
      subtitle: "Choose class & subjects",
      isCompleted: currentStep > 1,
      isDisabled: false,
    },
    {
      number: 2,
      label: "Configure Schedule",
      subtitle: "Set days & timings",
      isCompleted: currentStep > 2,
      isDisabled: currentStep < 2 && !formData.classId,
    },
    {
      number: 3,
      label: "Generate & Preview",
      subtitle: "Review AI allocation",
      isCompleted: !!timetable,
      isDisabled: currentStep < 3,
    },
  ];

  const handleNextStep1 = (data) => {
    // Add class name to formData for easier display
    const cls = classesData?.find(c => c._id === data.classId);
    setFormData((prev) => ({ ...prev, ...data, className: cls?.className }));
    setCurrentStep(2);
  };

  const handleNextStep2 = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleGenerate = (config) => {
    generateTimetable(config, {
      onSuccess: (result) => {
        setTimetable({
          ...result,
          class: config.classId,
          section: config.section,
          semester: config.semester,
          academicYear: config.academicYear,
          department: config.department
        });
        setConflicts(result.conflicts || []);
        setIsSaved(false);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to generate timetable");
      }
    });
  };

  const handleSave = (status = "draft", isAutoSave = false) => {
    saveTimetable({ timetableData: timetable, status }, {
      onSuccess: (savedData) => {
        setTimetable(savedData); // Updates with _id
        setIsSaved(true);
        if (isAutoSave) {
          setLastAutoSave(new Date());
          toast.success("Draft auto-saved", { icon: '💾' });
        } else {
          toast.success(`Timetable ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
          if (status === 'published') {
            navigate('/admin/timetable'); // Or wherever appropriate
          }
        }
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || `Failed to save ${status}`);
      }
    });
  };

  const handleCellEdit = (updatedSlot) => {
    // Update local state optimistic
    const updatedSlots = timetable.slots.map(s => {
      if (s.day === updatedSlot.day && s.startTime === updatedSlot.startTime) {
        return updatedSlot;
      }
      return s;
    });

    // Re-evaluate conflicts locally (simple check, backend would do proper check on save)
    // Here we just remove the conflict if it was resolved manually
    const updatedConflicts = conflicts.filter(c => 
      !(c.day === updatedSlot.day && c.startTime === updatedSlot.startTime && !updatedSlot.isConflict)
    );

    setTimetable(prev => ({
      ...prev,
      slots: updatedSlots,
      stats: {
        ...prev.stats,
        assignedSlots: updatedSlots.filter(s => s.subject !== null && !s.isBreak).length
      }
    }));
    
    setConflicts(updatedConflicts);
    setEditingSlot(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Create Timetable</h1>
            </div>
            <div className="flex items-center space-x-4">
              {lastAutoSave && !isSaved && (
                <span className="text-xs text-gray-500">
                  Auto-saved {lastAutoSave.toLocaleTimeString()} ✓
                </span>
              )}
              {timetable && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isSaved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isSaved ? "Saved" : "Unsaved Changes"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={(step) => setCurrentStep(step)} 
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 transition-all duration-500">
            {currentStep === 1 && (
              <Step1SelectClass 
                formData={formData} 
                onNext={handleNextStep1}
                existingTimetableWarning={false} // Would check via API ideally
              />
            )}

            {currentStep === 2 && (
              <Step2ConfigureSchedule 
                formData={formData} 
                requiredPeriods={formData.subjects?.reduce((sum, s) => sum + s.periodsPerWeek, 0) || 0}
                onNext={handleNextStep2} 
                onPrev={() => setCurrentStep(1)} 
              />
            )}

            {currentStep === 3 && (
              <Step3GeneratePreview 
                formData={formData}
                timetable={timetable}
                conflicts={conflicts}
                isGenerating={isGenerating}
                isSaving={isSaving}
                onGenerate={handleGenerate}
                onRegenerate={handleGenerate}
                onSave={handleSave}
                onPrev={() => setCurrentStep(2)}
                onCellClick={(slot) => setEditingSlot(slot)}
              />
            )}
          </div>

          {/* Teacher Workload Sidebar - Only show when timetable is generated */}
          {currentStep === 3 && timetable && (
            <div className="w-full lg:w-80 shrink-0 hidden lg:block animate-in fade-in slide-in-from-right-8 duration-500">
              <TeacherWorkloadPanel timetable={timetable} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Workload Toggle */}
      {currentStep === 3 && timetable && (
        <div className="lg:hidden mt-8 px-4 max-w-7xl mx-auto">
          <TeacherWorkloadPanel timetable={timetable} />
        </div>
      )}

      {/* Modals */}
      {editingSlot && (
        <CellEditModal 
          slot={editingSlot}
          formData={formData}
          onSave={handleCellEdit}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  );
};

export default CreateTimetablePage;
