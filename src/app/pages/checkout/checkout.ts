import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Constants } from '@src/app/constants/Constanct';
import { Toast } from '@src/app/core/toast';
import { ApiResponseModel } from '@src/app/models/api-response-model';
import { addToOrder, ICartList } from '@src/app/models/product-model';
import { Product } from '@src/app/services/product';
import { UserService } from '@src/app/services/user-service';
import { map, Observable, tap } from 'rxjs';

@Component({
  imports: [AsyncPipe, CurrencyPipe, PercentPipe, FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.scss',
  templateUrl: './checkout.html',
})
export class Checkout {
  productSrv = inject(Product);
  userSrv = inject(UserService);
  private readonly toast = inject(Toast);
  cartList: Observable<ICartList[]> = new Observable<ICartList[]>();
  subTotal = signal<number>(0);
  totalQuantity = signal<number>(0);
  discount = signal<number>(Constants.DISCOUNT_PRCT / 100);
  orderPlaced = signal(false);

  orderObj = new addToOrder();
  orderForm = new FormGroup({
    deliveryAddress1: new FormControl(this.orderObj.deliveryAddress1, Validators.required),
    deliveryAddress2: new FormControl(this.orderObj.deliveryAddress2),
    deliveryCity: new FormControl(this.orderObj.deliveryCity, Validators.required),
    deliveryPinCode: new FormControl(this.orderObj.deliveryPinCode, Validators.required),
    deliveryLandMark: new FormControl(this.orderObj.deliveryLandMark),
    paymentNaration: new FormControl(this.orderObj.paymentNaration),
  });

  constructor() {
    if (this.userSrv.loggedUserData?.custId) {
      this.cartList = this.productSrv.getCartsByCustId(this.userSrv.loggedUserData?.custId).pipe(
        tap((res: ApiResponseModel) => {
          let subtotal = 0;
          let quantity = 0;
          res.data?.forEach((item: ICartList) => {
            subtotal += item.productPrice * item.quantity;
            quantity += item.quantity;
          });
          this.subTotal.set(subtotal);
          this.totalQuantity.set(quantity);
        }),
        map((response: ApiResponseModel) => response.data),
      );
    }
  }

  onPlaceOrder() {
    const formValue = this.orderForm.getRawValue();

    this.orderObj = {
      ...this.orderObj,
      deliveryAddress1: formValue.deliveryAddress1 ?? '',
      deliveryAddress2: formValue.deliveryAddress2 ?? '',
      deliveryCity: formValue.deliveryCity ?? '',
      deliveryPinCode: formValue.deliveryPinCode ?? '',
      deliveryLandMark: formValue.deliveryLandMark ?? '',
      paymentNaration: formValue.paymentNaration ?? '',
      custId: this.userSrv.loggedUserData?.custId ?? 0,
      saleDate: new Date().toISOString(),
      totalInvoiceAmount: this.subTotal(),
      discount: this.subTotal() * this.discount(),
    };

    this.productSrv.placeOrder(this.orderObj).subscribe({
      next: (response: ApiResponseModel) => {
        if (response.result) {
          this.orderPlaced.set(true);
          this.toast.show('Order placed successfully!', 'success');
          this.userSrv.onOrderPlaced$.next();
        } else {
          this.toast.show('Failed to place order: ' + response.message, 'danger');
        }
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.toast.show('Something went wrong while placing your order. Please try again.', 'danger');
      },
    });
  }
}
