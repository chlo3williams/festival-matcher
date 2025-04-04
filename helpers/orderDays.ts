export default function orderDays(days: string[]): string[] {
  return [...days].sort((a, b) => {
    const getDateNumber = (dayStr: string) => {
      const match = dayStr.match(/\d+/); // extract number like 27, 28
      return match ? parseInt(match[0]) : 999; // fallback for "day TBC"
    };

    return getDateNumber(a) - getDateNumber(b);
  });
}
