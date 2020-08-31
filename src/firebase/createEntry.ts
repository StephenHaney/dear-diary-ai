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

  const docRef = await db.collection('entries').add({
    ip: locationData?.ip || null,
    latitude: locationData?.latitude || null,
    longitude: locationData?.longitude || null,
    keys: {},
    created: getServerTimestamp(),
    updated: getServerTimestamp(),
  });

  return docRef.id;
}
