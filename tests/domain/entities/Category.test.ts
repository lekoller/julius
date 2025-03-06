import { Category } from 'domain/entities/Category';

describe('Category', () => {
  describe('constructor', () => {
    it('should create a category with valid parameters', () => {
      const category = new Category(1, 'Test category');
      expect(category.id).toBe(1);
      expect(category.name).toBe('Test category');
    });

    it('should throw error for negative ID', () => {
      expect(() => new Category(-1, 'Test category')).toThrow('Category ID must be a non-negative number');
    });

    it('should throw error for empty name', () => {
      expect(() => new Category(1, '')).toThrow('Category name cannot be empty');
      expect(() => new Category(1, ' ')).toThrow('Category name cannot be empty');
      expect(() => new Category(1, '   ')).toThrow('Category name cannot be empty');
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const category = new Category(1, 'Test category');
      const json = category.toJSON();
      expect(json).toEqual({
        id: 1,
        name: 'Test category',
      });
    });
  });

  describe('fromJSON', () => {
    it('should create category from JSON', () => {
      const json = {
        id: 1,
        name: 'Test category',
      };

      const category = Category.fromJSON(json);
      expect(category.id).toBe(1);
      expect(category.name).toBe('Test category');
    });
  });
}); 