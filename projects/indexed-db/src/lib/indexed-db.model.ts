export class DataToStore {
  id: string;
  value: any;
  savedTime: string;
  cachedTime: number | null = null;

  constructor(id: string, value: any) {
    this.id = id;
    this.value = value;
    this.savedTime = new Date().toISOString(); // Generate the current timestamp
  }
}
