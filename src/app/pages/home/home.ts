import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@src/app/services/product';
import { IProduct } from '@src/app/models/product-model';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  public productService = inject(Product);
  public featuredProducts = signal<IProduct[]>([]);

  protected readonly categories = [
    { label: 'All', icon: 'bi-box-seam' },
    { label: 'Electronics', icon: 'bi-laptop' },
    { label: 'Fashion', icon: 'bi-bag' },
    { label: 'Home & Living', icon: 'bi-house-heart' },
    { label: 'Beauty', icon: 'bi-stars' },
    { label: 'Sports', icon: 'bi-dribbble' },
  ];

  ngOnInit() {
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
}
