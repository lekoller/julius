import { v4 as uuidv4 } from 'uuid';

export class Income {
  private readonly _id: string;
  private _timestamp: Date;

  constructor(
    private readonly _value: number,
    private readonly _name: string = '',
  ) {
    this.validateValue(_value);
    this.validateName(_name);
    this._timestamp = new Date();
    this._id = uuidv4();
  }

  get id(): string {
    return this._id;
  }

  get value(): number {
    return this._value;
  }

  get name(): string {
    return this._name;
  }

  get timestamp(): Date {
    return new Date(this._timestamp);
  }

  private validateValue(value: number): void {
    if (value <= 0) {
      throw new Error('Income value must be greater than zero');
    }
  }

  private validateName(name: string): void {
    if (name && !name.trim()) {
      throw new Error('Income name cannot be empty if provided');
    }
  }

  toJSON() {
    return {
      id: this._id,
      value: this._value,
      name: this._name,
      timestamp: this._timestamp.toISOString(),
    };
  }

  static fromJSON(json: any): Income {
    const income = new Income(json.value, json.name);
    income._timestamp = new Date(json.timestamp);
    return income;
  }
} 