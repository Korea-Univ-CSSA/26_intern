// utils/indexedDb.js
import { openDB } from "idb";

const DB_NAME = "zip-storage";
const STORE_NAME = "files";

export const getDb = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};
export const clearAllFiles = async () => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
  // console.log("✅ IndexedDB 초기화 완료");
};

export const getFile = async (filename) => {
  const db = await getDb();
  return db.get(STORE_NAME, filename); // blob 반환
};

export const getAllFilenames = async () => {
  const db = await getDb();
  return db.getAllKeys(STORE_NAME); // 파일 이름 목록
};

export const storeFile = async (filename, blob) => {
  const db = await getDb();
  await db.put(STORE_NAME, blob, filename);
};

export const getSingleFileWith_0_ = async () => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  let result = null;

  // openCursor로 순차 탐색
  let cursor = await store.openCursor();
  while (cursor) {
    const filename = cursor.key;
    if (typeof filename === "string" && filename.includes("_0_")) {
      const blob = cursor.value;
      result = { filename, blob };
      break; // 찾으면 바로 중단
    }
    cursor = await cursor.continue();
  }

  await tx.done;
  return result; // { filename, blob } 또는 null
};

export const getSingleFileWith_4_ = async () => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  let result = null;

  // openCursor로 순차 탐색
  let cursor = await store.openCursor();
  while (cursor) {
    const filename = cursor.key;
    if (typeof filename === "string" && filename.includes("_4_")) {
      const blob = cursor.value;
      result = { filename, blob };
      break; // 찾으면 바로 중단
    }
    cursor = await cursor.continue();
  }

  await tx.done;
  return result; // { filename, blob } 또는 null
};
