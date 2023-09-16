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

export { timeStamp, convertToDateTime, formatTime, timeValid };
