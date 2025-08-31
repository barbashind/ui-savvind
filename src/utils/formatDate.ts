export const formatDate = (iso?: string | Date | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return ''; // некорректная дата

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Приводим дату к локальному времени, компенсируя сдвиг UTC
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear().toString();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
};