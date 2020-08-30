import { db } from './initFirebase';
import getServerTimestamp from './getServerTimestamp';
import { dbKeyPress } from '../components/JournalScreen';

export function persistKeys(entryId: string, newKeys: dbKeyPress[]) {
  const batch = db.batch();
  const entryDoc = db.collection('entries').doc(entryId);

  for (const key of newKeys) {
    batch.update(entryDoc, {
      [`keys.${key.timeFromBegin}`]: key.key,
      ip: (window as any).ip,
    });
  }

  batch.update(entryDoc, {
    updated: getServerTimestamp(),
    ip: (window as any).ip,
  });

  return batch.commit();
}
