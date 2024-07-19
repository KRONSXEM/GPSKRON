import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getCurrentTime = ({ timestamp }: { timestamp?: Date } = {}) => {
  const now = timestamp ? new Date(timestamp) : new Date();

  const pad = (num: number) => num.toString().padStart(2, "0");

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1); // Месяцы в JavaScript начинаются с 0
  const year = pad(now.getFullYear() % 100); // Получаем последние 2 цифры года

  return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
};
