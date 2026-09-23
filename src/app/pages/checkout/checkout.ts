import { AsyncPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiResponseModel } from '@src/app/models/api-response-model';
import { ICartList } from '@src/app/models/product-model';
import { Product } from '@src/app/services/product';
import { UserService } from '@src/app/services/user-service';
import { map, Observable, tap } from 'rxjs';

@Component({
  imports: [AsyncPipe, CurrencyPipe, PercentPipe],
  selector: 'app-checkout',
  styleUrl: './checkout.scss',
  templateUrl: './checkout.html',
})
export class Checkout {
  productSrv = inject(Product);
  userSrv = inject(UserService);
  cartList: Observable<ICartList[]> = new Observable<ICartList[]>();
  subTotal = signal<number>(0);
  totalQuantity = signal<number>(0);
  discount = signal<number>(0.1); // 10% discount

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
}
