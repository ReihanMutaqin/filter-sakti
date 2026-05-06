import { useState, useEffect, useRef } from 'react';

const LS_KEY = 'filtersakti_visitors';
const HEARTBEAT_MS = 8_000;   // write heartbeat every 8 s
const STALE_THRESHOLD_MS = 30_000; // visitor considered offline after 30 s

interface VisitorEntry {
  id: string;
  ts: number;
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readEntries(): VisitorEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as VisitorEntry[];
  } catch {
    return [];
  }
}

function writeHeartbeat(myId: string) {
  const now = Date.now();
  const entries = readEntries().filter(e => now - e.ts < STALE_THRESHOLD_MS && e.id !== myId);
  entries.push({ id: myId, ts: now });
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  } catch { /* quota exceeded, ignore */ }
}

function countActive(): number {
  const now = Date.now();
  return readEntries().filter(e => now - e.ts < STALE_THRESHOLD_MS).length;
}

export function useOnlineVisitors(): number {
  const myId = useRef<string>(genId());
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    // Write our heartbeat immediately
    writeHeartbeat(myId.current);
    setCount(countActive());

    const interval = setInterval(() => {
      writeHeartbeat(myId.current);
      setCount(countActive());
    }, HEARTBEAT_MS);

    // Cleanup: remove our entry on unmount
    return () => {
      clearInterval(interval);
      try {
        const entries = readEntries().filter(e => e.id !== myId.current);
        localStorage.setItem(LS_KEY, JSON.stringify(entries));
      } catch { /* ignore */ }
    };
  }, []);

  return count;
}
