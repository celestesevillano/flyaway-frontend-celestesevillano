function key(email: string): string {
  return `bookings:${email}`;
}

export function getBookingIds(email: string): number[] {
  try {
    const raw = localStorage.getItem(key(email));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export function addBookingId(email: string, id: number): void {
  const ids = getBookingIds(email);
  if (ids.includes(id)) return;
  localStorage.setItem(key(email), JSON.stringify([...ids, id]));
}

export function removeBookingId(email: string, id: number): void {
  const ids = getBookingIds(email).filter((n) => n !== id);
  localStorage.setItem(key(email), JSON.stringify(ids));
}
