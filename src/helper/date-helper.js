import dayjs from "dayjs";

export const parseDate = (date) => {
  try {
    if (!date) return "";
    const formatDate = new Date(date);
    formatDate.setHours(formatDate.getHours() + 7);
    let dd = addZero(formatDate.getDate());
    let mm = addZero(formatDate.getMonth() + 1); //January is 0!

    let yy = formatDate.getFullYear();
    return dd + "-" + mm + "-" + yy;
  } catch (error) {
    console.log(error);
  }
};
export const parseWeekOfYear = (date) => {
  try {
    if (!date) return "";
    const formatDate = new Date(date);
    const firtDayYear = new Date(formatDate.getFullYear(), 0, 0)
    const timePeriodYear = formatDate - firtDayYear;
    const weekOfYear = (timePeriodYear / (1000 * 60 * 60 * 24 * 7));
    return "Tuần " + Math.ceil(weekOfYear) + " năm " + formatDate.getFullYear();
  } catch (error) {
    console.log(error);
  }
}
export const parseDateMonth = (date) => {
  try {
    if (!date) return "";
    const formatDate = new Date(date);
    formatDate.setHours(formatDate.getHours() + 7);
    let dd = addZero(formatDate.getDate());
    let mm = addZero(formatDate.getMonth() + 1); //January is 0!

    let yy = formatDate.getFullYear();
    return mm + "-" + yy;
  } catch (error) {
    console.log(error);
  }
};

export const parseDateYear = (date) => {
  try {
    if (!date) return "";
    const formatDate = new Date(date);
    formatDate.setHours(formatDate.getHours() + 7);
    let dd = addZero(formatDate.getDate());
    let mm = addZero(formatDate.getMonth() + 1); //January is 0!

    let yy = formatDate.getFullYear();
    return yy;
  } catch (error) {
    console.log(error);
  }
};
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
export function parseDateHH(date) {
  return date ? dayjs(date).format("DD/MM/YYYY | HH:mm") : "";
}
export function parseDateDDMMYYYY(date) {
  return date ? dayjs(date).format("DD/MM/YYYY") : "";
}
export function formatWorkingTime(workingTime) {
  if (typeof workingTime === "number" || typeof workingTime === "string") {
    const totalMinutes = Math.round(parseFloat(workingTime) / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    let day = 0;
    let hour = totalHours;
    if (totalHours > 23) {
      day = Math.floor(totalHours / 24);
      hour = totalHours % 24;
    }
    let result = "";
    if (day) result += `${day} ngày `;
    if (hour) result += `${hour} giờ `;
    if (minute) result += `${minute} phút`;
    return result.trim() || "--";
  }
  return "--";
}
export function formatMillisToHHMM(ms) {
  if (!ms || isNaN(ms)) return "00:00";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
export function formatMillisToHHMMSS(ms) {
  if (!ms || isNaN(ms)) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
export const parseDateNotSum7 = (date) => {
  try {
    if (!date) return "";
    const formatDate = new Date(date);
    formatDate.setHours(formatDate.getHours());
    let dd = addZero(formatDate.getDate());
    let mm = addZero(formatDate.getMonth() + 1); //January is 0!

    let yy = formatDate.getFullYear();
    return dd + "-" + mm + "-" + yy;
  } catch (error) {
    console.log(error);
  }
};