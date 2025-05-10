import fs from 'fs/promises';
import path from 'path';
import { BaseEntity } from '../../types';
import { BaseRepository } from '../base.repository';

export abstract class FileBaseRepository<T extends BaseEntity> extends BaseRepository<T> {
  protected filePath: string;
  protected dataDir: string;

  constructor(fileName: string) {
    super();
    this.dataDir = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, `${fileName}.json`);
    this.initStorage().catch(console.error);
  }

  protected async initStorage(): Promise<void> {
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

  protected async readFile(): Promise<T[]> {
    try {
      await this.initStorage(); // Ensure storage is initialized
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  protected async writeFile(data: T[]): Promise<void> {
    try {
      await this.initStorage(); // Ensure storage is initialized
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    const items = await this.readFile();
    if (Object.keys(filter).length === 0) {
      return items;
    }
    return items.filter((item) =>
      Object.entries(filter).every(
        ([key, value]) => item[key as keyof T] === value
      )
    );
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.readFile();
    return items.find((item) => item.id === id) || null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const items = await this.readFile();
    return (
      items.find((item) =>
        Object.entries(filter).every(
          ([key, value]) => item[key as keyof T] === value
        )
      ) || null
    );
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = await this.readFile();
    const timestamp = this.getCurrentTimestamp();
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    } as T;
    
    items.push(newItem);
    await this.writeFile(items);
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.readFile();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { 
      ...items[index], 
      ...data,
      updatedAt: this.getCurrentTimestamp()
    };
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