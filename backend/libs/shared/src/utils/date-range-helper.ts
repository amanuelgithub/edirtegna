import { add, format } from 'date-fns';

export const getStartAndEndDates = (dateRangeString: string): { start: string; end: string } => {
  const startEnd = dateRangeString.split(',');
  const s = format(new Date(startEnd[0]), 'yyyy-MM-dd hh:mm:ss a');
  const e = format(add(new Date(startEnd[1]), { days: 1 }), 'yyyy-MM-dd hh:mm:ss a');

  return { start: `${s.split(' ')[0]} 00:00:00.000000`, end: `${e.split(' ')[0]} 00:00:00.000000` };
};

export const dateAfterMonths = (date, months: number): Date => {
  // 👇 Make copy with "Date()" constructor
  const dateCopy = new Date(date);
  dateCopy.setMonth(dateCopy.getMonth() + months);
  return dateCopy;
};
export const dateAfterYears = (date, years: number): Date => {
  // 👇 Make copy with "Date()" constructor
  const dateCopy = new Date(date);
  dateCopy.setFullYear(dateCopy.getFullYear() + years);
  return dateCopy;
};
