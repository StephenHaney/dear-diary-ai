import { db } from './initFirebase';
import getServerTimestamp from './getServerTimestamp';

export type Entry = {
  ip: string | null;
  latitude: string | null;
  longitude: string | null;
  keys: Record<number, string>;
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
