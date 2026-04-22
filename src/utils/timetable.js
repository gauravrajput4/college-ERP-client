export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const timeToMinutes = (value) => {
  const [hours, minutes] = String(value || "").split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  return hours * 60 + minutes;
};

export const addMinutesToTime = (value, minutesToAdd = 45) => {
  const minutes = timeToMinutes(value);
  if (minutes === null) return "";
  const total = minutes + minutesToAdd;
  const hours = Math.floor((total % 1440) / 60);
  const minutesPart = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}`;
};

export const formatTimeLabel = (value) => {
  const minutes = timeToMinutes(value);
  if (minutes === null) return value || "-";

  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
};

export const getCurrentDayName = (date = new Date()) => {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[date.getDay()];
};

export const getLectureStatus = (entry, now = new Date()) => {
  const currentDay = getCurrentDayName(now);
  if (entry.day !== currentDay) {
    const currentIndex = DAYS.indexOf(currentDay);
    const entryIndex = DAYS.indexOf(entry.day);
    if (entryIndex === -1 || currentIndex === -1 || entryIndex < currentIndex) return "Completed";
    return "Upcoming";
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(entry.startTime);
  const endMinutes = timeToMinutes(entry.endTime);

  if (startMinutes === null || endMinutes === null) return "Upcoming";
  if (currentMinutes < startMinutes) return "Upcoming";
  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) return "Ongoing";
  return "Completed";
};

export const getStatusClasses = (status) => {
  if (status === "Ongoing") return "bg-emerald-100 text-emerald-700";
  if (status === "Upcoming") return "bg-sky-100 text-sky-700";
  return "bg-slate-200 text-slate-600";
};

export const sortTimetableEntries = (entries = []) =>
  [...entries].sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

export const getTodayLectures = (entries = [], now = new Date()) =>
  sortTimetableEntries(entries.filter((entry) => entry.day === getCurrentDayName(now)));

export const getNextLecture = (entries = [], now = new Date()) => {
  const currentDay = getCurrentDayName(now);
  const currentDayIndex = DAYS.indexOf(currentDay);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return sortTimetableEntries(entries).find((entry) => {
    const dayIndex = DAYS.indexOf(entry.day);
    if (dayIndex === -1 || currentDayIndex === -1) return false;
    if (dayIndex > currentDayIndex) return true;
    if (dayIndex < currentDayIndex) return false;
    return timeToMinutes(entry.endTime) > currentMinutes;
  }) || null;
};
