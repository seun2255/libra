const timeStamp = () => {
  const date = new Date();
  var day = date.getDate();
  if (day < 10) day = `0${day}`;
  var month = date.getMonth();
  if (month < 10) month = `0${month}`;
  var year = date.getFullYear();
  var hour = date.getHours();
  if (hour < 10) hour = `0${hour}`;
  var minute = date.getMinutes();
  if (minute < 10) minute = `0${minute}`;

  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const fileUploadTime = (date) => {
  // Ensure the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid Date");
  }

  // Define months and get date components
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert 24-hour time to 12-hour time
  const formattedHours = hours % 12 || 12;

  // Format the date string
  const formattedDate = `${month}/${day}/${year}, ${formattedHours}:${String(
    minutes
  ).padStart(2, "0")} ${ampm}`;

  return formattedDate;
};

const convertToDateTime = (timestampString) => {
  const [datePart, timePart] = timestampString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  } else {
    return `${minutes}:${padZero(remainingSeconds)}`;
  }
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}

function timeValid(targetDate) {
  const now = new Date();
  const expiryDate = new Date(targetDate);
  return now.getTime() < expiryDate.getTime();
}

export { timeStamp, convertToDateTime, formatTime, timeValid, fileUploadTime };
