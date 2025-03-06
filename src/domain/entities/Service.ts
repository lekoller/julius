import { Consumable } from './Consumable';

export class Service extends Consumable {
  constructor(
    name: string,
    category: string,
    private readonly _value: number,
    private readonly _description?: string,
  ) {
    super(name, category);
    this.validateValue(_value);
    if (_description) {
      this.validateDescription(_description);
    }
  }

  get value(): number {
    return this._value;
  }

  get description(): string | undefined {
    return this._description;
  }

  calculateValue(): number {
    return this._value;
  }

  private validateValue(value: number): void {
    if (value <= 0) {
      throw new Error('Service value must be greater than zero');
    }
  }

  private validateDescription(description: string): void {
    if (description.trim().length === 0) {
      throw new Error('Service description cannot be empty if provided');
    }
  }

  toJSON() {
    return {
      type: 'service',
      name: this._name,
      category: this._category,
      value: this._value,
      description: this._description,
    };
  }

  static fromJSON(json: any): Service {
    return new Service(
      json.name,
      json.category,
      json.value,
      json.description,
    );
  }
} 