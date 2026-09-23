import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@src/app/services/product';
import { addToCart, ICartItem, ICategory, IProduct } from '@src/app/models/product-model';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Constants } from '@src/app/constants/Constanct';
import { UserService } from '@src/app/services/user-service';
import { Toast } from '@src/app/core/toast';
import { IRegisterModel } from '@src/app/models/user-model';

// bootstrap.bundle.min.js is loaded globally (see angular.json "scripts"),
// the same script that already drives the modal/offcanvas/dropdown —
// this just gives TypeScript a type for the global it exposes.
declare const bootstrap: any;

@Component({
  imports: [RouterLink, AsyncPipe, FormsModule, CurrencyPipe],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  public productService = inject(Product);
  public userService = inject(UserService);
  private readonly toast = inject(Toast);
  public featuredProducts = signal<IProduct[]>([]);
  public selectedCategoryId = signal<number>(0);

  isAddToCartDisable: boolean = false;

  public selectedProduct!: IProduct;
  public cartObj: ICartItem = new addToCart();

  public $categoriesList: Observable<ICategory[]> = new Observable<ICategory[]>();

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

  onAddToCart(product: IProduct) {
    this.selectedProduct = product;
  }

  saveCartData() {
    let loggedUserData: IRegisterModel | undefined = this.userService.loggedUserData;
    if (loggedUserData) {
      this.cartObj.custId = loggedUserData.custId;
    }
    this.cartObj.productId = this.selectedProduct.productId;
    this.cartObj.addedDate = new Date().toISOString();
    this.isAddToCartDisable = true;
    this.productService.addToCart(this.cartObj).subscribe({
      next: (res) => {
        this.toast.show('Added to cart successfully!', 'success');
        this.userService.onAddToCart$.next();
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addToCartModal')).hide();
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.toast.show('Could not add item to cart. Please try again.', 'danger');
        this.isAddToCartDisable = false;
      },
    });
  }
}
