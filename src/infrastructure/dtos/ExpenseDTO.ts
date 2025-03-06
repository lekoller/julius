export interface CategoryDTO {
  id: number;
  name: string;
}

export interface ProductDTO {
  type: 'product';
  name: string;
  category: string;
  unitaryValue?: number;
  quantity?: number;
  kilogramValue?: number;
  weight?: number;
}

export interface ServiceDTO {
  type: 'service';
  name: string;
  category: string;
  value: number;
  description?: string;
}

export type ConsumableDTO = ProductDTO | ServiceDTO;

export interface ExpenseDTO {
  id: string;
  value: number;
  name: string;
  category?: string;
  items?: ConsumableDTO[];
  timestamp: string;
} 