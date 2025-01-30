const now = new Date();
export default function CompareTime({login_time}) {
  const hours = now.getHours(); // Gets the current hour (0-23)
  const minutes = now.getMinutes(); // Gets the current minute (0-59)
  const seconds = now.getSeconds(); // Gets the current second (0-59)

  const fixed_time = convertStringtoMilli(login_time);
  const current_time = convertStringtoMilli(`${hours}:${minutes}:${seconds}`);

  if (current_time - fixed_time > 1) {
    return 'Half day';
  } else {
    return 'Full day';
  }
}

function convertStringtoMilli(str) {
  // Split the input string by colon
  const [hours, minutes, seconds] = str.split(':').map(Number);

  // Convert hours, minutes, and seconds to milliseconds
  const hoursInMs = hours * 60 * 60 * 1000;
  const minutesInMs = minutes * 60 * 1000;
  const secondsInMs = seconds * 1000;

  return hoursInMs + minutesInMs + secondsInMs;
}

export function getDateAndTime() {
  const hours = now.getHours(); // Gets the current hour (0-23)
  const minutes = now.getMinutes(); // Gets the current minute (0-59)
  const seconds = now.getSeconds(); // Gets the current second (0-59)

  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${year}-${month}-${day}`;

  return `${currentDate} ${hours}:${minutes}:${seconds}`;
}
