export abstract class Consumable {
  constructor(
    protected readonly _name: string,
    protected readonly _category: string,
  ) {
    this.validateName(_name);
    this.validateCategory(_category);
  }

  get name(): string {
    return this._name;
  }

  get category(): string {
    return this._category;
  }

  abstract calculateValue(): number;

  protected validateName(name: string): void {
    if (!name.trim()) {
      throw new Error('Name cannot be empty');
    }
  }

  protected validateCategory(category: string): void {
    if (!category.trim()) {
      throw new Error('Category cannot be empty');
    }
  }

  abstract toJSON(): any;

  static fromJSON(json: any): Consumable {
    if (json.type === 'product') {
      return Product.fromJSON(json);
    } else if (json.type === 'service') {
      return Service.fromJSON(json);
    }
    throw new Error('Invalid consumable type');
  }
}

export class Product extends Consumable {
  constructor(
    name: string,
    category: string,
    private readonly _quantity?: number,
    private readonly _weight?: number,
    private readonly _unitaryValue?: number,
    private readonly _kilogramValue?: number,
  ) {
    super(name, category);
    this.validateQuantityAndWeight();
    this.validateValues();
  }

  get quantity(): number | undefined {
    return this._quantity;
  }

  get weight(): number | undefined {
    return this._weight;
  }

  get unitaryValue(): number | undefined {
    return this._unitaryValue;
  }

  get kilogramValue(): number | undefined {
    return this._kilogramValue;
  }

  calculateValue(): number {
    if (this._quantity && this._unitaryValue) {
      return this._quantity * this._unitaryValue;
    }
    if (this._weight && this._kilogramValue) {
      return this._weight * this._kilogramValue;
    }
    throw new Error('Cannot calculate value without proper measurements');
  }

  private validateQuantityAndWeight(): void {
    if (this._quantity !== undefined && this._weight !== undefined) {
      throw new Error('Product cannot have both quantity and weight');
    }
    if (this._quantity !== undefined && this._quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (this._weight !== undefined && this._weight <= 0) {
      throw new Error('Weight must be greater than zero');
    }
  }

  private validateValues(): void {
    if (this._quantity !== undefined && this._unitaryValue === undefined) {
      throw new Error('Product with quantity must have unitary value');
    }
    if (this._weight !== undefined && this._kilogramValue === undefined) {
      throw new Error('Product with weight must have kilogram value');
    }
    if (this._unitaryValue !== undefined && this._unitaryValue <= 0) {
      throw new Error('Unitary value must be greater than zero');
    }
    if (this._kilogramValue !== undefined && this._kilogramValue <= 0) {
      throw new Error('Kilogram value must be greater than zero');
    }
  }

  toJSON() {
    return {
      type: 'product',
      name: this._name,
      category: this._category,
      quantity: this._quantity,
      weight: this._weight,
      unitaryValue: this._unitaryValue,
      kilogramValue: this._kilogramValue,
    };
  }

  static fromJSON(json: any): Product {
    return new Product(
      json.name,
      json.category,
      json.quantity,
      json.weight,
      json.unitaryValue,
      json.kilogramValue,
    );
  }
}

export class Service extends Consumable {
  constructor(
    name: string,
    category: string,
    private readonly _description: string = '',
    private readonly _value: number,
  ) {
    super(name, category);
    this.validateValue(_value);
  }

  get description(): string {
    return this._description;
  }

  get value(): number {
    return this._value;
  }

  calculateValue(): number {
    return this._value;
  }

  private validateValue(value: number): void {
    if (value <= 0) {
      throw new Error('Service value must be greater than zero');
    }
  }

  toJSON() {
    return {
      type: 'service',
      name: this._name,
      category: this._category,
      description: this._description,
      value: this._value,
    };
  }

  static fromJSON(json: any): Service {
    return new Service(
      json.name,
      json.category,
      json.description,
      json.value,
    );
  }
} 