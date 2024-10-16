// src/db.js
/*import { openDB } from 'idb';

const dbPromise = openDB('AddictionApp', 1, {
  upgrade(db) {
    db.createObjectStore('userRecords', { keyPath: 'id', autoIncrement: true });
  },
});

export async function addRecord(record) {
  const db = await dbPromise;
  return db.add('userRecords', record);
}

export async function getAllRecords() {
  const db = await dbPromise;
  return db.getAll('userRecords');
}*/

// db.js
import { openDB } from 'idb';

const dbPromise = openDB('AddictionApp', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        db.createObjectStore('userRecords', { keyPath: 'id', autoIncrement: true });
        console.log('userRecords store created');
      }
      if (oldVersion < 2) {
        db.createObjectStore('progressRecords', { keyPath: 'id', autoIncrement: true });
        console.log('progressRecords store created');
      }
    },
  });

export async function addRecord(record) {
  const db = await dbPromise;
  return db.add('userRecords', record);
}

export async function getAllRecords() {
  const db = await dbPromise;
  return db.getAll('userRecords');
}

export async function addProgressRecord(progressRecord) {
  const db = await dbPromise;
  return db.add('progressRecords', progressRecord);
}

export async function getAllProgressRecords() {
  const db = await dbPromise;
  if (!db.objectStoreNames.contains('progressRecords')) {
    console.warn('progressRecords object store not found');
    return [];
  }
  return db.getAll('progressRecords');
}