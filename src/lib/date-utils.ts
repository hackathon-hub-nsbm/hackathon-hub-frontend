export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (n: number): string => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}

export function formatTime(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(":");
  const hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}.${String(minutes).padStart(2, "0")} ${period}`;
}

export function truncateStr(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now.getTime() - past.getTime()) / 1000;

  if (diff < 60) {
    const secs = Math.floor(diff);
    return secs <= 1 ? "just now" : `${secs} seconds ago`;
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return mins === 1 ? "1 min ago" : `${mins} mins ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else {
    return past.toLocaleDateString();
  }
}
