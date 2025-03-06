import { Consumable } from './Consumable';
import { v4 as uuidv4 } from 'uuid';

export class Expense {
  private readonly _id: string;
  private _timestamp: Date;
  private _category?: string;
  private _items: Consumable[] = [];

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

  get category(): string | undefined {
    return this._category;
  }

  get items(): Consumable[] {
    return [...this._items];
  }

  private validateValue(value: number): void {
    if (value <= 0) {
      throw new Error('Expense value must be greater than zero');
    }
  }

  private validateName(name: string): void {
    if (name && !name.trim()) {
      throw new Error('Expense name cannot be empty if provided');
    }
  }

  setCategory(category: string): void {
    if (!category.trim()) {
      throw new Error('Category cannot be empty');
    }
    this._category = category;
  }

  addItem(item: Consumable): void {
    this._items.push(item);
  }

  toJSON() {
    return {
      id: this._id,
      value: this._value,
      name: this._name,
      timestamp: this._timestamp.toISOString(),
      category: this._category,
      items: this._items.map(item => item.toJSON()),
    };
  }

  static fromJSON(json: any): Expense {
    const expense = new Expense(json.value, json.name);
    expense._timestamp = new Date(json.timestamp);
    if (json.category) {
      expense._category = json.category;
    }
    expense._items = json.items.map(Consumable.fromJSON);
    return expense;
  }
} 