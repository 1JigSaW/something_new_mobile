export const getTodayKey = (prefix?: string): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dateKey = `${yyyy}-${mm}-${dd}`;
  return prefix ? `${prefix}:${dateKey}` : dateKey;
};

export const getTodayString = (): string => {
  return new Date().toDateString();
};
