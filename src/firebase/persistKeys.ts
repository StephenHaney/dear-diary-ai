import { db } from './initFirebase';
import getServerTimestamp from './getServerTimestamp';

export type dbNote = {
  note: string;
  velocity: number;
  duration: number;
  delayFromKeyPress: number;
};

export type dbKeyPress = {
  type: 'key';
  key: string;
  timeFromBegin: number;
  notes: Array<dbNote>;
};

export type dbSelectionEvent = {
  type: 'selection';
  selectionStart: number;
  selectionEnd: number;
  timeFromBegin: number;
};

export function persistEventIsKey(event: dbKeyPress | dbSelectionEvent): event is dbKeyPress {
  return event.type === 'key';
}

export function persistEventIsSelection(event: dbKeyPress | dbSelectionEvent): event is dbSelectionEvent {
  return event.type === 'selection';
}

export function persistKeys(entryId: string, persistEvents: Array<dbKeyPress | dbSelectionEvent>) {
  const batch = db.batch();
  const entryDoc = db.collection('entries').doc(entryId);

  for (const persistEvent of persistEvents) {
    if (persistEventIsKey(persistEvent)) {
      batch.update(entryDoc, {
        [`events.${persistEvent.timeFromBegin}`]: {
          key: persistEvent.key,
          type: persistEvent.type,
          notes: persistEvent.notes,
        },
        ip: (window as any).ip,
      });
    } else if (persistEventIsSelection(persistEvent)) {
      batch.update(entryDoc, {
        [`events.${persistEvent.timeFromBegin}`]: {
          type: persistEvent.type,
          selectionStart: persistEvent.selectionStart,
          selectionEnd: persistEvent.selectionEnd,
        },
        ip: (window as any).ip,
      });
    }
  }

  batch.update(entryDoc, {
    updated: getServerTimestamp(),
    ip: (window as any).ip,
  });

  return batch.commit();
}
