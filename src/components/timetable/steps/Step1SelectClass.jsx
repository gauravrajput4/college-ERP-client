import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema } from "../../../../../shared/validators/timetableValidator.js";
import { useClasses, useSections, useSubjectsByClass } from "../../../hooks/queries/useTimetable.js";
import { AlertCircle, GraduationCap, ChevronRight } from "lucide-react";

const Step1SelectClass = ({ formData, onNext, existingTimetableWarning }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watchClassId = watch("classId");
  const watchDepartment = watch("department");
  const watchSubjects = watch("subjects") || [];

  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { data: sectionsData, isLoading: loadingSections } = useSections(watchClassId);
  const { data: subjectsData, isLoading: loadingSubjects } = useSubjectsByClass(watchClassId);

  // Derive unique departments from classes data
  const departments = classesData ? [...new Set(classesData.map((c) => c.department))] : [];
  
  // Filter classes by selected department
  const filteredClasses = classesData 
    ? classesData.filter(c => c.department === watchDepartment) 
    : [];

  // When subjects load, auto-populate if not already set
  useEffect(() => {
    if (subjectsData && subjectsData.length > 0) {
      // Only set if we haven't already populated it for this class
      if (!formData.subjects || formData.subjects.length === 0 || formData.classId !== watchClassId) {
        setValue(
          "subjects",
          subjectsData.map((s) => ({
            subjectId: s._id,
            subjectName: s.subjectName,
            subjectCode: s.subjectCode,
            periodsPerWeek: s.periodsPerWeek || 4,
          }))
        );
      }
    }
  }, [subjectsData, watchClassId, setValue, formData]);

  const totalPeriods = watchSubjects.reduce((sum, s) => sum + (s.periodsPerWeek || 0), 0);

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {existingTimetableWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Existing Timetable Found</h3>
            <p className="text-sm text-amber-700 mt-1">
              A timetable already exists for this class/section. Proceeding will replace the existing draft.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Select Class & Section</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              )}
            />
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
            <Controller
              name="academicYear"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select Year</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              )}
            />
            {errors.academicYear && <p className="mt-1 text-xs text-red-500">{errors.academicYear.message}</p>}
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <Controller
              name="classId"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  disabled={!watchDepartment || loadingClasses}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
                >
                  <option value="">Select Class</option>
                  {filteredClasses.map((c) => (
                    <option key={c._id} value={c._id}>{c.className}</option>
                  ))}
                </select>
              )}
            />
            {errors.classId && <p className="mt-1 text-xs text-red-500">{errors.classId.message}</p>}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
            <Controller
              name="semester"
              control={control}
              render={({ field }) => {
                const selectedClass = filteredClasses.find(c => c._id === watchClassId);
                const semesters = selectedClass?.semester || []; // assuming semester is an array or we just hardcode 1-8 based on typical
                
                return (
                  <select 
                    {...field} 
                    disabled={!watchClassId}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
                  >
                    <option value="">Select Semester</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                  </select>
                )
              }}
            />
            {errors.semester && <p className="mt-1 text-xs text-red-500">{errors.semester.message}</p>}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  disabled={!watchClassId || loadingSections}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
                >
                  <option value="">Select Section</option>
                  {sectionsData && sectionsData.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
            />
            {errors.section && <p className="mt-1 text-xs text-red-500">{errors.section.message}</p>}
          </div>
        </div>
      </div>

      {watchClassId && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Subjects Configuration</h3>
          
          {loadingSubjects ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : watchSubjects.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periods/Week</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {watchSubjects.map((subject, index) => (
                      <tr key={subject.subjectId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subject.subjectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subject.subjectCode || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Controller
                            name={`subjects.${index}.periodsPerWeek`}
                            control={control}
                            render={({ field }) => (
                              <select 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                {[...Array(10)].map((_, i) => (
                                  <option key={i+1} value={i+1}>{i+1}</option>
                                ))}
                              </select>
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-indigo-700 font-medium">Total periods/week:</span>
                  <span className="ml-2 text-xl font-bold text-indigo-900">{totalPeriods}</span>
                </div>
                <div className="text-xs text-indigo-600/80 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Must be fulfilled by available schedule slots in next step
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No subjects found for this class.</p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={!isValid || watchSubjects.length === 0}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
          <ChevronRight className="ml-2 -mr-1 w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default Step1SelectClass;
