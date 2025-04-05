import fs from 'fs/promises';
import path from 'path';

export class FileStorage<T extends { id: string }> {
  private filePath: string;
  private dataDir: string;

  constructor(fileName: string) {
    this.dataDir = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, `${fileName}.json`);
    this.initStorage();
  }

  private async initStorage() {
    try {
      // Check if data directory exists
      try {
        await fs.access(this.dataDir);
      } catch {
        // Create data directory if it doesn't exist
        await fs.mkdir(this.dataDir, { recursive: true });
      }

      // Check if file exists
      try {
        await fs.access(this.filePath);
      } catch {
        // Create empty file if it doesn't exist
        await fs.writeFile(this.filePath, '[]');
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw error;
    }
  }

  private async readFile(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  private async writeFile(data: T[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const items = await this.readFile();
    return (
      items.find((item) =>
        Object.entries(query).every(
          ([key, value]) => item[key as keyof T] === value
        )
      ) || null
    );
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    const items = await this.readFile();
    return items.filter((item) =>
      Object.entries(query).every(
        ([key, value]) => item[key as keyof T] === value
      )
    );
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    await this.initStorage(); // Ensure storage is initialized
    const items = await this.readFile();
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 15),
    } as T;
    items.push(newItem);
    await this.writeFile(items);
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.readFile();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...items[index], ...data };
    items[index] = updatedItem;
    await this.writeFile(items);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readFile();
    const filteredItems = items.filter((item) => item.id !== id);
    if (filteredItems.length === items.length) return false;
    await this.writeFile(filteredItems);
    return true;
  }
}
