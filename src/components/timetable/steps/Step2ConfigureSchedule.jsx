import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "../../../../../shared/validators/timetableValidator.js";
import { Clock, Calendar, Coffee, Plus, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_OPTIONS = [];
for (let i = 6; i <= 20; i++) {
  TIME_OPTIONS.push(`${i.toString().padStart(2, "0")}:00`);
  TIME_OPTIONS.push(`${i.toString().padStart(2, "0")}:30`);
}

const Step2ConfigureSchedule = ({ formData, requiredPeriods, onNext, onPrev }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      workingDays: formData.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: formData.startTime || "09:00",
      endTime: formData.endTime || "15:00",
      lectureDuration: formData.lectureDuration || 45,
      breakSlots: formData.breakSlots || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "breakSlots",
  });

  const watchWorkingDays = watch("workingDays");
  const watchStartTime = watch("startTime");
  const watchEndTime = watch("endTime");
  const watchDuration = watch("lectureDuration");
  const watchBreaks = watch("breakSlots");

  const [stats, setStats] = useState({
    totalDurationMins: 0,
    periodsPerDay: 0,
    totalWeeklyPeriods: 0,
    previewSlots: [],
  });

  // Calculate live stats and preview strip
  useEffect(() => {
    if (!watchStartTime || !watchEndTime || !watchDuration) return;

    const [startH, startM] = watchStartTime.split(":").map(Number);
    const [endH, endM] = watchEndTime.split(":").map(Number);
    
    let totalMins = (endH * 60 + endM) - (startH * 60 + startM);
    
    if (totalMins <= 0) {
      setStats({ totalDurationMins: 0, periodsPerDay: 0, totalWeeklyPeriods: 0, previewSlots: [] });
      return;
    }

    let breakMins = 0;
    const breaksByPeriod = {};
    if (watchBreaks && watchBreaks.length > 0) {
      watchBreaks.forEach(b => {
        breakMins += (b.duration || 0);
        if (b.afterPeriod) breaksByPeriod[b.afterPeriod] = b;
      });
    }

    const availableMins = totalMins - breakMins;
    const periodsPerDay = Math.floor(availableMins / parseInt(watchDuration, 10));
    const totalWeeklyPeriods = periodsPerDay * (watchWorkingDays?.length || 0);

    // Build preview strip
    const previewSlots = [];
    let currentMins = startH * 60 + startM;
    let periodNum = 1;
    
    const formatTime = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    while (currentMins + parseInt(watchDuration, 10) <= (endH * 60 + endM) && periodNum <= periodsPerDay) {
      previewSlots.push({
        type: 'period',
        label: `P-${periodNum}`,
        duration: watchDuration,
        startTime: formatTime(currentMins)
      });
      currentMins += parseInt(watchDuration, 10);

      if (breaksByPeriod[periodNum] && currentMins + parseInt(breaksByPeriod[periodNum].duration, 10) <= (endH * 60 + endM)) {
        previewSlots.push({
          type: 'break',
          label: breaksByPeriod[periodNum].label || 'Break',
          duration: breaksByPeriod[periodNum].duration,
          startTime: formatTime(currentMins)
        });
        currentMins += parseInt(breaksByPeriod[periodNum].duration, 10);
      }
      periodNum++;
    }

    setStats({
      totalDurationMins: totalMins,
      periodsPerDay,
      totalWeeklyPeriods,
      previewSlots
    });
  }, [watchStartTime, watchEndTime, watchDuration, watchBreaks, watchWorkingDays]);

  const toggleDay = (day) => {
    const current = watchWorkingDays || [];
    if (current.includes(day)) {
      if (current.length > 1) { // keep at least 1
        setValue("workingDays", current.filter(d => d !== day), { shouldValidate: true });
      }
    } else {
      setValue("workingDays", [...current, day], { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    onNext(data);
  };

  const isSufficient = stats.totalWeeklyPeriods >= requiredPeriods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* SECTION A: Working Days */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-md font-semibold text-gray-900">Working Days *</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {ALL_DAYS.map(day => {
            const isSelected = watchWorkingDays?.includes(day);
            return (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`relative px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                  isSelected 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm" 
                    : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
                }`}
              >
                {day}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-0.5">
                    <Clock className="w-3 h-3" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {errors.workingDays && <p className="mt-2 text-xs text-red-500">{errors.workingDays.message}</p>}
        <p className="mt-3 text-sm text-gray-500">
          Selected: {watchWorkingDays?.join(", ")} ({watchWorkingDays?.length} days)
        </p>
      </div>

      {/* SECTION B: Timing */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-md font-semibold text-gray-900">Class Timing</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  {TIME_OPTIONS.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
                </select>
              )}
            />
            {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  {TIME_OPTIONS.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
                </select>
              )}
            />
            {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime.message}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Duration *</label>
          <Controller
            name="lectureDuration"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-4">
                {[30, 45, 60].map(dur => (
                  <label key={dur} className={`flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer transition-colors ${field.value === dur ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={field.value === dur}
                      onChange={() => field.onChange(dur)}
                    />
                    {dur} mins
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Stats Summary */}
        <div className={`p-4 rounded-lg flex flex-col md:flex-row items-center justify-between border ${isSufficient ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex flex-col mb-2 md:mb-0">
            <span className="text-sm font-medium text-gray-700">Auto-calculated Capacity:</span>
            <span className="text-xs text-gray-500">Available: {stats.periodsPerDay} per day × {watchWorkingDays?.length} days</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{stats.totalWeeklyPeriods}</span>
              <span className="text-xs text-gray-500">Total Slots</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <span className={`block text-2xl font-bold ${isSufficient ? 'text-green-600' : 'text-red-600'}`}>{requiredPeriods}</span>
              <span className="text-xs text-gray-500">Required</span>
            </div>
          </div>
        </div>
        {!isSufficient && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Not enough slots! Increase working hours, add days, or reduce lecture duration.
          </p>
        )}
      </div>

      {/* SECTION C: Breaks */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-md font-semibold text-gray-900">Break Configuration (Optional)</h3>
          </div>
          {fields.length < 3 && (
            <button
              type="button"
              onClick={() => append({ afterPeriod: 2, duration: 15, label: "Short Break" })}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Break
            </button>
          )}
        </div>

        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row items-end gap-4 p-4 border rounded-lg bg-gray-50 relative group">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">After Period</label>
                <Controller
                  name={`breakSlots.${index}.afterPeriod`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      {[1,2,3,4,5,6,7,8,9].map(p => <option key={p} value={p}>Period {p}</option>)}
                    </select>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                <Controller
                  name={`breakSlots.${index}.duration`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value={10}>10 mins</option>
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                    </select>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                <Controller
                  name={`breakSlots.${index}.label`}
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="text" placeholder="e.g. Lunch" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  )}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">No breaks configured. Continuous schedule.</p>
          )}
        </div>
      </div>

      {/* SECTION D: Live Preview Strip */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg overflow-hidden">
        <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">👁 Schedule Preview (Single Day)</h3>
        
        <div className="flex overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-1 min-w-max">
            {stats.previewSlots.map((slot, idx) => (
              <div key={idx} className={`flex flex-col ${slot.type === 'break' ? 'w-24' : 'w-32'}`}>
                <div className="text-xs text-gray-400 mb-1 pl-1">{slot.startTime}</div>
                <div className={`h-16 rounded-lg flex flex-col justify-center items-center px-2 border border-gray-700
                  ${slot.type === 'break' 
                    ? 'bg-gray-800 text-amber-400 border-dashed' 
                    : 'bg-indigo-900/50 text-indigo-100'}
                `}>
                  <span className="font-semibold text-sm truncate w-full text-center">{slot.label}</span>
                  <span className="text-xs opacity-70">{slot.duration}m</span>
                </div>
              </div>
            ))}
            {stats.previewSlots.length === 0 && (
              <div className="text-gray-500 text-sm">Configure valid times to see preview</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ChevronLeft className="mr-2 -ml-1 w-4 h-4" />
          Previous Step
        </button>
        <button
          type="submit"
          disabled={!isValid || !isSufficient}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Generate Preview
          <ChevronRight className="ml-2 -mr-1 w-4 h-4" />
        </button>
      </div>

    </form>
  );
};

export default Step2ConfigureSchedule;
