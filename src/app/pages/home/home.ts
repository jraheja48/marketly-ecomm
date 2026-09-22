import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@src/app/services/product';
import { ICategory, IProduct } from '@src/app/models/product-model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [RouterLink, AsyncPipe],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  public productService = inject(Product);
  public featuredProducts = signal<IProduct[]>([]);

  public $categoriesList: Observable<ICategory[]> = new Observable<ICategory[]>();
  public selectedCategoryId = signal<number>(0);

  ngOnInit() {
    this.$categoriesList = this.productService.getAllCategories();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        console.log('Products fetched successfully:', response);
        this.featuredProducts.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  filterProduct(categoryId: number) {
    this.selectedCategoryId.set(categoryId);
    if (categoryId === 0) {
      this.getAllProducts();
      return;
    }
    this.productService.filterProductByCategory(categoryId).subscribe({
      next: (res) => this.featuredProducts.set(res.data),
      error: (err) => {
        this.featuredProducts.set([]);
      },
    });
  }
}
