import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-product-details',
  styleUrl: './product-details.scss',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  protected readonly thumbnails = [0, 1, 2, 3];
  protected readonly activeThumbnail = signal(0);
  protected readonly sizes = ['S', 'M', 'L', 'XL'];
  protected readonly selectedSize = signal('M');
  protected readonly quantity = signal(1);

  protected selectThumbnail(index: number): void {
    this.activeThumbnail.set(index);
  }

  protected selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  protected decrementQuantity(): void {
    this.quantity.update((qty) => Math.max(1, qty - 1));
  }

  protected incrementQuantity(): void {
    this.quantity.update((qty) => qty + 1);
  }
}
