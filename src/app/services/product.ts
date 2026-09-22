import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment.development';
import { Constants } from '@src/app/constants/Constanct';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../models/api-response-model';

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
}
