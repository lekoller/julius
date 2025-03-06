import { Consumable } from './Consumable';

export class Product extends Consumable {
  constructor(
    name: string,
    category: string,
    private readonly _unitaryValue?: number,
    private readonly _quantity?: number,
    private readonly _kilogramValue?: number,
    private readonly _weight?: number,
  ) {
    super(name, category);
    this.validateValues();
  }

  get unitaryValue(): number | undefined {
    return this._unitaryValue;
  }

  get quantity(): number | undefined {
    return this._quantity;
  }

  get kilogramValue(): number | undefined {
    return this._kilogramValue;
  }

  get weight(): number | undefined {
    return this._weight;
  }

  calculateValue(): number {
    if (this._unitaryValue !== undefined && this._quantity !== undefined) {
      return this._unitaryValue * this._quantity;
    }
    if (this._kilogramValue !== undefined && this._weight !== undefined) {
      return this._kilogramValue * this._weight;
    }
    throw new Error('Product must have either unitary value and quantity or kilogram value and weight');
  }

  private validateValues(): void {
    const hasUnitaryInfo = this._unitaryValue !== undefined && this._quantity !== undefined;
    const hasWeightInfo = this._kilogramValue !== undefined && this._weight !== undefined;

    if (!hasUnitaryInfo && !hasWeightInfo) {
      throw new Error('Product must have either unitary value and quantity or kilogram value and weight');
    }

    if (hasUnitaryInfo) {
      this.validateUnitaryValue(this._unitaryValue);
      this.validateQuantity(this._quantity);
    }

    if (hasWeightInfo) {
      this.validateKilogramValue(this._kilogramValue);
      this.validateWeight(this._weight);
    }
  }

  private validateUnitaryValue(value: number): void {
    if (value <= 0) {
      throw new Error('Unitary value must be greater than zero');
    }
  }

  private validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
  }

  private validateKilogramValue(value: number): void {
    if (value <= 0) {
      throw new Error('Kilogram value must be greater than zero');
    }
  }

  private validateWeight(weight: number): void {
    if (weight <= 0) {
      throw new Error('Weight must be greater than zero');
    }
  }

  toJSON() {
    return {
      type: 'product',
      name: this._name,
      category: this._category,
      unitaryValue: this._unitaryValue,
      quantity: this._quantity,
      kilogramValue: this._kilogramValue,
      weight: this._weight,
    };
  }

  static fromJSON(json: any): Product {
    return new Product(
      json.name,
      json.category,
      json.unitaryValue,
      json.quantity,
      json.kilogramValue,
      json.weight,
    );
  }
} 