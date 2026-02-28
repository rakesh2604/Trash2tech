export type OfflineQueueItem = {
  id: string;
  createdAt: string;
  request: {
    method: 'POST' | 'PATCH';
    path: string;
    body: unknown;
  };
};

const KEY = 'ewaste_offline_queue_v1';

function readQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineQueueItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items: OfflineQueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const offlineQueue = {
  list(): OfflineQueueItem[] {
    return readQueue();
  },
  add(item: OfflineQueueItem) {
    const q = readQueue();
    q.push(item);
    writeQueue(q);
  },
  remove(id: string) {
    const q = readQueue().filter((x) => x.id !== id);
    writeQueue(q);
  },
  clear() {
    writeQueue([]);
  }
};

