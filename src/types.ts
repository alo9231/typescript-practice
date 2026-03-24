export interface Product {
  id: number;
  name: string;
  category: 'Electronics' | 'Clothing' | 'Home'; // 카테고리 제한
  price: number;
  inStock: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  onlyInStock: boolean;
}