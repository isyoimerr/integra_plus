const DB_NAME = 'integra_plus_assistant_db';
const DB_VERSION = 1;
const STORE_RESPONSES = 'assistant_responses';
const STORE_LOGS = 'assistant_logs';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB no está disponible en este navegador.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_RESPONSES)) {
        db.createObjectStore(STORE_RESPONSES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        db.createObjectStore(STORE_LOGS, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transaction(storeName, mode = 'readonly') {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return { store, tx };
}

export const localDb = {
  async getAllResponses() {
    const { store, tx } = await transaction(STORE_RESPONSES, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async putResponse(response) {
    const { store } = await transaction(STORE_RESPONSES, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(response);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getResponseById(id) {
    const { store } = await transaction(STORE_RESPONSES, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async addLog(logEntry) {
    const { store } = await transaction(STORE_LOGS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(logEntry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllLogs() {
    const { store } = await transaction(STORE_LOGS, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async clearLogs() {
    const { store } = await transaction(STORE_LOGS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
