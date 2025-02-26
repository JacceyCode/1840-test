import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  return date.toLocaleString("en-US", {
    month: "short", // "Apr"
    day: "2-digit", // "30"
    year: "numeric", // "2020"
  });
}
