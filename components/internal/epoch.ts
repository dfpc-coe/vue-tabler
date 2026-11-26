/** A Date from epoch milliseconds or a date string, numeric strings are read as milliseconds */
export function parseEpoch(value: number | string): Date | null {
    const numeric = typeof value === 'string' && value.trim().length && !Number.isNaN(Number(value));
    const date = new Date(numeric ? Number(value) : value);
    return Number.isNaN(date.getTime()) ? null : date;
}
