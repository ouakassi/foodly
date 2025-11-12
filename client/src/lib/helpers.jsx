export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export function formatDateToYMD(date) {
  if (!(date instanceof Date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthRange(year, month) {
  // month is 0-indexed: 0 = Jan, 11 = Dec
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month, 0); // Day 0 of next month = last day of current month

  return { firstDay, lastDay };
}

export function getCurrentMonthYear() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(), // 0-indexed: 0 = Jan, 11 = Dec
  };
}

export const generateSlug = (source) => {
  if (source) {
    const slug = source
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return slug;
  }
};
