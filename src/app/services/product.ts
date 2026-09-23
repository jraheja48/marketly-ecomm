import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment.development';
import { Constants } from '@src/app/constants/Constanct';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response-model';
import { ICartItem, ICategory, IOrder } from '../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class Product {
  http = inject(HttpClient);

  getAllProducts(): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.GET_ALL_PRODUCTS,
    );
  }

  getAllCategories(): Observable<ICategory[]> {
    return this.http
      .get<ApiResponseModel>(environment.API_URL + Constants.API_END_POINTS.GET_ALL_CATEGORIES)
      .pipe(
        map((result: ApiResponseModel) => {
          if (result.data?.length > 0) {
            result.data.unshift({
              categoryId: 0,
              categoryName: 'All',
              parentCategoryId: 0,
              userId: 0,
            });
          }
          return result.data;
        }),
      );
  }

  filterProductByCategory(id: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.FILTER_PRODUCT_BY_CAT_ID + id,
    );
  }

  addToCart(cartItem: ICartItem): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.ADD_TO_CART,
      cartItem,
    );
  }

  getCartsByCustId(custId: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.GET_CART_ITEM_BY_CUST_ID + custId,
    );
  }

  DeleteProductFromCartById(cartID: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.DELETE_PRODUCT_FROM_CART + cartID,
    );
  }

  placeOrder(orderObj: IOrder): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.PLACE_ORDER,
      orderObj,
    );
  }

  cancelOrder(salesID: number): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.CANCEL_ORDER + '?saleId=' + salesID,
    );
  }
}
