import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment.development';
import { Constants } from '@src/app/constants/Constanct';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response-model';
import { ICategory } from '../models/product-model';

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
}
