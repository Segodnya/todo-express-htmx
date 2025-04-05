import { BaseService } from '@/services/base.service';
import { IBaseRepository } from '@/repositories';
import { BaseEntity } from '@/types';

// Sample entity type for testing
interface TestEntity extends BaseEntity {
  name: string;
  value: number;
}

// Mock repository
class MockRepository implements IBaseRepository<TestEntity> {
  private entities: Map<string, TestEntity> = new Map();

  async findAll(filter?: Partial<TestEntity>): Promise<TestEntity[]> {
    const entities = Array.from(this.entities.values());
    if (!filter) return entities;

    return entities.filter((entity) => {
      return Object.entries(filter).every(([key, value]) => {
        return entity[key as keyof TestEntity] === value;
      });
    });
  }

  async findById(id: string): Promise<TestEntity | null> {
    return this.entities.get(id) || null;
  }

  async findOne(filter: Partial<TestEntity>): Promise<TestEntity | null> {
    const entities = await this.findAll(filter);
    return entities.length > 0 ? entities[0] : null;
  }

  async create(
    data: Omit<TestEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TestEntity> {
    const id = `test-${Date.now()}`;
    const timestamp = Date.now();
    const entity: TestEntity = {
      ...(data as any),
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.entities.set(id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<TestEntity>
  ): Promise<TestEntity | null> {
    const entity = await this.findById(id);
    if (!entity) return null;

    const updatedEntity: TestEntity = {
      ...entity,
      ...data,
      updatedAt: Date.now(),
    };

    this.entities.set(id, updatedEntity);
    return updatedEntity;
  }

  async delete(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  // Helper method for testing
  addEntity(entity: TestEntity): void {
    this.entities.set(entity.id, entity);
  }
}

// Concrete implementation of BaseService for testing
class TestService extends BaseService<TestEntity> {
  constructor(repository: IBaseRepository<TestEntity>) {
    super(repository);
  }
}

describe('BaseService', () => {
  let service: TestService;
  let repository: MockRepository;

  beforeEach(() => {
    repository = new MockRepository();
    service = new TestService(repository);

    // Add some test data
    const timestamp = Date.now();
    repository.addEntity({
      id: 'test-1',
      name: 'Test 1',
      value: 100,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    repository.addEntity({
      id: 'test-2',
      name: 'Test 2',
      value: 200,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });

  describe('findAll', () => {
    it('should return all entities when no filter is provided', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toContain('test-1');
      expect(result.map((e) => e.id)).toContain('test-2');
    });

    it('should filter entities based on criteria', async () => {
      // Act
      const result = await service.findAll({ name: 'Test 1' });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-1');
    });
  });

  describe('findById', () => {
    it('should return an entity by id if it exists', async () => {
      // Act
      const result = await service.findById('test-1');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-1');
      expect(result?.name).toBe('Test 1');
    });

    it('should return null if entity does not exist', async () => {
      // Act
      const result = await service.findById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return the first entity matching criteria', async () => {
      // Act
      const result = await service.findOne({ value: 200 });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-2');
    });

    it('should return null if no entity matches criteria', async () => {
      // Act
      const result = await service.findOne({ value: 300 });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new entity', async () => {
      // Arrange
      const newEntityData = {
        name: 'New Test',
        value: 300,
      };

      // Act
      const result = await service.create(newEntityData);

      // Assert
      expect(result).toMatchObject(newEntityData);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify it was added to the repository
      const entities = await service.findAll();
      expect(entities).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should update and return an entity if it exists', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Test 1',
        value: 150,
      };

      // Act
      const result = await service.update('test-1', updateData);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.name).toBe(updateData.name);
      expect(result?.value).toBe(updateData.value);
      expect(result?.id).toBe('test-1');
    });

    it('should return null if entity to update does not exist', async () => {
      // Act
      const result = await service.update('non-existent', { name: 'Updated' });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an entity and return true if it exists', async () => {
      // Act
      const result = await service.delete('test-1');

      // Assert
      expect(result).toBe(true);

      // Verify it was removed from the repository
      const entities = await service.findAll();
      expect(entities).toHaveLength(1);
      expect(entities[0].id).toBe('test-2');
    });

    it('should return false if entity to delete does not exist', async () => {
      // Act
      const result = await service.delete('non-existent');

      // Assert
      expect(result).toBe(false);

      // Verify no entities were removed
      const entities = await service.findAll();
      expect(entities).toHaveLength(2);
    });
  });
});
