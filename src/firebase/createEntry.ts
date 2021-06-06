import { db } from './initFirebase';
import getServerTimestamp from './getServerTimestamp';
import { dbKeyPress, dbSelectionEvent } from './persistKeys';

export type Entry = {
  ip: string | null;
  latitude: string | null;
  longitude: string | null;
  events: Record<number, dbKeyPress | dbSelectionEvent>;
  created: number;
  updated: number;
};

export async function generateEntry() {
  const locationData = await (await fetch('/api/getLocationByIp')).json();
  (window as any).ip = locationData.ip;

  const newEntry = {
    ip: locationData?.ip || null,
    latitude: locationData?.latitude || null,
    longitude: locationData?.longitude || null,
    keys: {},
    created: getServerTimestamp(),
    updated: getServerTimestamp(),
  };

  const docRef = await db.collection('entries').add(newEntry);

  return {
    id: docRef.id,
    entry: newEntry,
  };
}

export function getLocalEntries() {
  const entriesString = localStorage.getItem("entries") ?? "[]";
  const entries = JSON.parse(entriesString);
  return entries;
}
