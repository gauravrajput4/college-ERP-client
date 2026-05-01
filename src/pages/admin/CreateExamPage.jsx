import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Trash2, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { createExam as createExamApi, updateExam as updateExamApi } from "../../api/exams.api";
import CriteriaSlider from "../../components/admitCard/CriteriaSlider";
import EligibilityPreviewTable from "../../components/admitCard/EligibilityPreviewTable";
import SmartExamPreviewTable from "../../components/admitCard/SmartExamPreviewTable";
import { showError, showSuccess } from "../../components/Toast";
import { useCreateExam, useEligibilityPreview, useGenerateExamSchedule } from "../../hooks/queries/useExams";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be > 0"),
});

const slotSchema = z.object({
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
});

// We only require subjects in the generated output for saving, but we can accept selected subjects in step 2.
const configSchema = z.object({
  name: z.string().min(3),
  type: z.enum(["internal", "external"]),
  semester: z.string().min(1),
  academicYear: z.string().min(1),
  department: z.string().min(1),
  class: z.string().min(1),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  slotsPerDay: z.array(slotSchema).min(1, "At least one slot required"),
  rooms: z.array(roomSchema).min(1, "At least one room required"),
  selectedSubjects: z.array(z.string()).min(1, "Select at least one subject"),
  eligibilityCriteria: z.object({
    minAttendancePercent: z.coerce.number().min(0).max(100),
    minFeesPaidPercent: z.coerce.number().min(0).max(100),
  }),
});

const subjectOptions = [
  { label: "Data Structures", value: "660c1d1a8e1b9b1a1c1d1e1f", code: "CS301" }, // Mock IDs
  { label: "Algorithms", value: "660c1d1a8e1b9b1a1c1d1e20", code: "CS302" },
  { label: "Database Systems", value: "660c1d1a8e1b9b1a1c1d1e21", code: "CS303" },
  { label: "Operating Systems", value: "660c1d1a8e1b9b1a1c1d1e22", code: "CS304" },
];

const CreateExamPage = () => {
  const navigate = useNavigate();
  const createExam = useCreateExam();
  const generateScheduleMut = useGenerateExamSchedule();
  
  const [step, setStep] = useState(1);
  const [draftExamId, setDraftExamId] = useState("");
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  
  const [previewCriteria, setPreviewCriteria] = useState({
    minAttendancePercent: 60,
    minFeesPaidPercent: 50,
  });

  const { data: preview, refetch: refetchPreview, isFetching: isPreviewLoading } = useEligibilityPreview(draftExamId, previewCriteria);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: {
      name: "",
      type: "internal",
      semester: "Semester 1",
      academicYear: "2026-27",
      department: "Computer Science",
      class: "FY",
      startDate: "",
      endDate: "",
      slotsPerDay: [{ start: "09:00", end: "12:00" }],
      rooms: [
        { name: "Room 101", capacity: 50 },
        { name: "Room 102", capacity: 50 }
      ],
      selectedSubjects: [],
      eligibilityCriteria: {
        minAttendancePercent: 60,
        minFeesPaidPercent: 50,
      },
    },
  });

  const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({ control, name: "slotsPerDay" });
  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({ control, name: "rooms" });
  
  const values = watch();

  const handleGenerate = async () => {
    if (!values.class || !values.startDate || !values.endDate || !values.selectedSubjects.length) {
      showError("Please complete configuration fields before generating.");
      return;
    }

    generateScheduleMut.mutate(
      {
        classId: values.class,
        semester: values.semester,
        department: values.department,
        startDate: values.startDate,
        endDate: values.endDate,
        slotsPerDay: values.slotsPerDay,
        rooms: values.rooms,
        subjects: values.selectedSubjects
      },
      {
        onSuccess: (res) => {
          setGeneratedSchedule(res.data);
          setScheduleConflicts([]);
        }
      }
    );
  };

  const moveScheduleItem = (index, direction) => {
    const newSchedule = [...generatedSchedule];
    if (direction === "up" && index > 0) {
      const temp = newSchedule[index];
      newSchedule[index] = newSchedule[index - 1];
      newSchedule[index - 1] = temp;
    } else if (direction === "down" && index < newSchedule.length - 1) {
      const temp = newSchedule[index];
      newSchedule[index] = newSchedule[index + 1];
      newSchedule[index + 1] = temp;
    }
    
    // Check conflicts (basic check if two exams are on same date)
    const conflicts = [];
    const dateCounts = {};
    newSchedule.forEach(s => {
      dateCounts[s.date] = (dateCounts[s.date] || 0) + 1;
      if (dateCounts[s.date] > 1) {
        conflicts.push({ date: s.date, subject: s.subject });
      }
    });
    setScheduleConflicts(conflicts);
    setGeneratedSchedule(newSchedule);
  };

  const saveDraft = async () => {
    if (generatedSchedule.length === 0) throw new Error("Please generate a schedule first.");
    
    const payload = { ...values, subjects: generatedSchedule };
    
    if (draftExamId) {
      await updateExamApi(draftExamId, payload);
      return draftExamId;
    }

    const response = await createExamApi(payload);
    const nextId = response?.data?._id;
    if (!nextId) throw new Error("Draft exam could not be created");
    setDraftExamId(nextId);
    return nextId;
  };

  const handlePreview = async () => {
    try {
      await saveDraft();
      setPreviewCriteria(values.eligibilityCriteria);
      await refetchPreview();
      showSuccess("Eligibility preview refreshed");
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || "Preview failed");
    }
  };

  const onSubmit = async (formValues) => {
    if (generatedSchedule.length === 0) {
      showError("Please auto-generate the schedule before saving.");
      return;
    }
    if (scheduleConflicts.length > 0) {
      showError("Please resolve schedule conflicts before saving.");
      return;
    }

    const payload = { ...formValues, subjects: generatedSchedule };
    try {
      if (draftExamId) {
        await updateExamApi(draftExamId, payload);
        navigate(`/admin/exams/${draftExamId}`);
        return;
      }
      const response = await createExam.mutateAsync(payload);
      navigate(`/admin/exams/${response?.data?._id}`);
    } catch (error) {
      showError(error?.response?.data?.message || "Unable to save exam");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Smart Exam Setup</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create Exam Configuration</h1>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStep(item)}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${step === item ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Step {item}: {item === 1 ? "Class Setup" : item === 2 ? "Schedule Config" : "Eligibility & Save"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 ? (
          <div className="grid gap-4 rounded-xl bg-white p-6 shadow-card md:grid-cols-2">
            {[
              ["name", "Exam name"],
              ["academicYear", "Academic year"],
              ["department", "Department"],
              ["class", "Class"],
              ["semester", "Semester"],
            ].map(([field, label]) => (
              <label key={field} className="grid gap-2 text-sm font-medium text-slate-700">
                {label}
                <Controller control={control} name={field} render={({ field: controllerField }) => <input {...controllerField} className="rounded-md border border-slate-200 px-3 py-2.5" />} />
                {errors[field] ? <span className="text-xs text-rose-600">{errors[field]?.message}</span> : null}
              </label>
            ))}
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Exam type
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="inline-flex rounded-md bg-slate-100 p-1">
                    {["internal", "external"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => field.onChange(type)}
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${field.value === type ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                      >
                        {type === "internal" ? "Internal" : "External"}
                      </button>
                    ))}
                  </div>
                )}
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6 rounded-xl bg-white p-6 shadow-card">
            
            {/* Config Section */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Dates & Subjects */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">1. Dates & Subjects</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Start Date
                    <Controller control={control} name="startDate" render={({ field }) => <input {...field} type="date" className="rounded-md border border-slate-200 px-3 py-2" />} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    End Date
                    <Controller control={control} name="endDate" render={({ field }) => <input {...field} type="date" className="rounded-md border border-slate-200 px-3 py-2" />} />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Select Subjects (Hold Ctrl/Cmd to select multiple)
                  <Controller 
                    control={control} 
                    name="selectedSubjects" 
                    render={({ field }) => (
                      <select 
                        multiple 
                        {...field} 
                        onChange={(e) => field.onChange(Array.from(e.target.selectedOptions, option => option.value))}
                        className="rounded-md border border-slate-200 px-3 py-2 h-32"
                      >
                        {subjectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label} ({opt.code})</option>)}
                      </select>
                    )} 
                  />
                  {errors.selectedSubjects && <span className="text-xs text-rose-600">{errors.selectedSubjects.message}</span>}
                </label>
              </div>

              {/* Slots & Rooms */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">2. Slots & Rooms</h3>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Daily Time Slots</span>
                    <button type="button" onClick={() => appendSlot({ start: "", end: "" })} className="text-indigo-600 text-xs font-semibold flex items-center"><Plus size={14} className="mr-1"/> Add Slot</button>
                  </div>
                  {slotFields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-center">
                      <Controller control={control} name={`slotsPerDay.${idx}.start`} render={({ field: cField }) => <input {...cField} type="time" className="rounded-md border border-slate-200 px-2 py-1.5 text-sm flex-1" />} />
                      <span>to</span>
                      <Controller control={control} name={`slotsPerDay.${idx}.end`} render={({ field: cField }) => <input {...cField} type="time" className="rounded-md border border-slate-200 px-2 py-1.5 text-sm flex-1" />} />
                      <button type="button" onClick={() => removeSlot(idx)} className="text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 mt-4">
                    <span className="text-sm font-medium text-slate-700">Available Rooms</span>
                    <button type="button" onClick={() => appendRoom({ name: "", capacity: 50 })} className="text-indigo-600 text-xs font-semibold flex items-center"><Plus size={14} className="mr-1"/> Add Room</button>
                  </div>
                  {roomFields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-center">
                      <Controller control={control} name={`rooms.${idx}.name`} render={({ field: cField }) => <input {...cField} placeholder="Room name" className="rounded-md border border-slate-200 px-2 py-1.5 text-sm flex-1" />} />
                      <Controller control={control} name={`rooms.${idx}.capacity`} render={({ field: cField }) => <input {...cField} type="number" placeholder="Capacity" className="rounded-md border border-slate-200 px-2 py-1.5 text-sm w-24" />} />
                      <button type="button" onClick={() => removeRoom(idx)} className="text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center py-4 border-t border-b">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateScheduleMut.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
              >
                <Zap size={18} />
                {generateScheduleMut.isPending ? "Generating..." : "🚀 Auto Generate Schedule"}
              </button>
            </div>

            {/* Smart Preview Table */}
            {generatedSchedule.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 mb-4">Generated Schedule Preview</h3>
                <SmartExamPreviewTable 
                  schedule={generatedSchedule} 
                  conflicts={scheduleConflicts}
                  onMoveUp={(idx) => moveScheduleItem(idx, "up")}
                  onMoveDown={(idx) => moveScheduleItem(idx, "down")}
                />
              </div>
            )}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-card">
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="eligibilityCriteria.minAttendancePercent"
                render={({ field }) => (
                  <CriteriaSlider
                    label="Attendance Criteria"
                    helperText={`Students must have ≥ ${field.value}% attendance`}
                    value={field.value}
                    onChange={field.onChange}
                    onDebouncedChange={(nextValue) => setPreviewCriteria((prev) => ({ ...prev, minAttendancePercent: nextValue }))}
                    estimatedEligibleCount={preview?.summary?.eligibleCount}
                  />
                )}
              />
              <Controller
                control={control}
                name="eligibilityCriteria.minFeesPaidPercent"
                render={({ field }) => (
                  <CriteriaSlider
                    label="Fees Criteria"
                    helperText={`Students must have paid ≥ ${field.value}% of fees`}
                    value={field.value}
                    onChange={field.onChange}
                    onDebouncedChange={(nextValue) => setPreviewCriteria((prev) => ({ ...prev, minFeesPaidPercent: nextValue }))}
                    estimatedEligibleCount={preview?.summary?.eligibleCount}
                  />
                )}
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
              <p className="mt-2 text-sm text-slate-600">
                Students must have at least {values.eligibilityCriteria.minAttendancePercent}% attendance and {values.eligibilityCriteria.minFeesPaidPercent}% fees paid.
              </p>
              <button type="button" onClick={handlePreview} className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                <Search size={16} />
                {isPreviewLoading ? "Refreshing Preview..." : "Preview Eligibility"}
              </button>
            </div>

            {preview ? <EligibilityPreviewTable preview={preview} /> : null}
          </div>
        ) : null}

        <div className="flex justify-between">
          <button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
            Back
          </button>
          {step < 3 ? (
            <button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              {isSubmitting ? "Saving..." : "Save Exam"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateExamPage;
