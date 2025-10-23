// Storage interface for in-memory data
// This app doesn't require persistent storage as it's a stateless emotion detection service

export interface IStorage {
  // Placeholder for future storage needs if required
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
