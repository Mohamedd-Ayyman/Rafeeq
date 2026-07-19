import { openDB } from "idb";

const DB_NAME = "rafeeq-offline";
const STORE = "queue";

const getDb = async () => {
  if (typeof window === "undefined") return null;
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "clientId",
        });
        store.createIndex("type", "type");
      }
    },
  });
};

export const enqueue = async (item) => {
  const db = await getDb();
  if (!db) return;
  const clientId =
    item.clientId ||
    `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.put(STORE, { ...item, clientId, createdAt: Date.now() });
  return clientId;
};

export const getQueue = async () => {
  const db = await getDb();
  if (!db) return [];
  return db.getAll(STORE);
};

export const clearQueue = async () => {
  const db = await getDb();
  if (!db) return;
  await db.clear(STORE);
};

export const removeItem = async (clientId) => {
  const db = await getDb();
  if (!db) return;
  await db.delete(STORE, clientId);
};

export const isOnline = () => (typeof navigator !== "undefined" ? navigator.onLine : true);
