import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

type SortOption = 'Popularity' | 'Price: Low to High' | 'Price: High to Low' | 'Newest';

@Component({
  imports: [RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList {
  protected readonly filtersOpen = signal(false);
  protected readonly sortMenuOpen = signal(false);

  protected readonly categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];
  protected readonly selectedCategories = signal(new Set<string>(['Electronics']));

  protected readonly priceMin = 20;
  protected readonly priceMax = 300;
  protected readonly priceLimit = signal(150);

  protected readonly minRating = signal<number | null>(null);

  protected readonly sortOptions: SortOption[] = [
    'Popularity',
    'Price: Low to High',
    'Price: High to Low',
    'Newest',
  ];
  protected readonly sortBy = signal<SortOption>('Popularity');

  protected readonly currentPage = signal(1);
  protected readonly totalPages = 8;

  protected readonly stars = [1, 2, 3, 4];

  protected readonly products: Product[] = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 89, rating: 4 },
    { id: 2, name: 'Smart Watch Series 5', category: 'Electronics', price: 249, rating: 5 },
    { id: 3, name: 'Running Sneakers', category: 'Sports', price: 64, rating: 4 },
    { id: 4, name: 'Ceramic Mug Set', category: 'Home & Living', price: 28, rating: 4 },
    { id: 5, name: 'Leather Backpack', category: 'Fashion', price: 112, rating: 5 },
    { id: 6, name: 'Bluetooth Speaker', category: 'Electronics', price: 59, rating: 4 },
    { id: 7, name: 'Desk Lamp', category: 'Home & Living', price: 35, rating: 3 },
    { id: 8, name: 'Sunglasses', category: 'Fashion', price: 55, rating: 4 },
    { id: 9, name: 'Yoga Mat', category: 'Sports', price: 30, rating: 4 },
  ];

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages;
    const current = this.currentPage();
    const pages = new Set<number>([1, 2, 3, total, current]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= total)
      .sort((a, b) => a - b);
  });

  protected toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  protected toggleSortMenu(): void {
    this.sortMenuOpen.update((open) => !open);
  }

  protected chooseSort(option: SortOption): void {
    this.sortBy.set(option);
    this.sortMenuOpen.set(false);
  }

  protected toggleCategory(category: string): void {
    this.selectedCategories.update((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  protected resetFilters(): void {
    this.selectedCategories.set(new Set());
    this.priceLimit.set(this.priceMax);
    this.minRating.set(null);
  }

  protected toggleRating(rating: number): void {
    this.minRating.update((current) => (current === rating ? null : rating));
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }
}
