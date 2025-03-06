export class Category {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
  ) {
    this.validateId(_id);
    this.validateName(_name);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  private validateId(id: number): void {
    if (id < 0) {
      throw new Error('Category ID must be a non-negative number');
    }
  }

  private validateName(name: string): void {
    if (!name.trim()) {
      throw new Error('Category name cannot be empty');
    }
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
    };
  }

  static fromJSON(json: any): Category {
    return new Category(json.id, json.name);
  }
} 