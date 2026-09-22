import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
}

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly categories = [
    { label: 'All', icon: 'bi-box-seam' },
    { label: 'Electronics', icon: 'bi-laptop' },
    { label: 'Fashion', icon: 'bi-bag' },
    { label: 'Home & Living', icon: 'bi-house-heart' },
    { label: 'Beauty', icon: 'bi-stars' },
    { label: 'Sports', icon: 'bi-dribbble' },
  ];

  protected readonly featuredProducts: FeaturedProduct[] = [
    { id: 1, name: 'Wireless Headphones', price: 79 },
    { id: 2, name: 'Canvas Backpack', price: 45 },
    { id: 3, name: 'Smart Watch', price: 129 },
    { id: 4, name: 'Ceramic Mug Set', price: 24 },
    { id: 5, name: 'Running Shoes', price: 89 },
    { id: 6, name: 'Desk Lamp', price: 35 },
    { id: 7, name: 'Sunglasses', price: 55 },
    { id: 8, name: 'Yoga Mat', price: 30 },
  ];
}
