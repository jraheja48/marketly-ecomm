import { Component, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  imports: [],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList {
  protected readonly filtersOpen = signal(false);

  protected readonly categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];

  protected readonly products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 79, category: 'Electronics' },
    { id: 2, name: 'Canvas Backpack', price: 45, category: 'Fashion' },
    { id: 3, name: 'Smart Watch', price: 129, category: 'Electronics' },
    { id: 4, name: 'Ceramic Mug Set', price: 24, category: 'Home & Living' },
    { id: 5, name: 'Running Shoes', price: 89, category: 'Sports' },
    { id: 6, name: 'Desk Lamp', price: 35, category: 'Home & Living' },
    { id: 7, name: 'Sunglasses', price: 55, category: 'Fashion' },
    { id: 8, name: 'Yoga Mat', price: 30, category: 'Sports' },
    { id: 9, name: 'Bluetooth Speaker', price: 59, category: 'Electronics' },
    { id: 10, name: 'Face Serum', price: 32, category: 'Beauty' },
    { id: 11, name: 'Denim Jacket', price: 68, category: 'Fashion' },
    { id: 12, name: 'Throw Pillow', price: 18, category: 'Home & Living' },
  ];

  protected toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }
}
