import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { ILoginModel, IRegisterModel } from '../models/user-model';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../constants/Constanct';
import { environment } from '@src/environments/environment.development';
import { ApiResponseModel } from '../models/api-response-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  onLogin$: Subject<void> = new Subject<void>();
  onAddToCart$: Subject<void> = new Subject<void>();
  loggedUserData: IRegisterModel | undefined;

  constructor() {
    this.readLoggedData();
  }

  public readLoggedData(): void {
    const loggedUserData = localStorage.getItem(Constants.LOGIN_STORAGE_KEY);
    if (loggedUserData) {
      this.loggedUserData = JSON.parse(loggedUserData);
    }
  }

  onRegister(userDetail: IRegisterModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.REGISTER_USER,
      userDetail,
    );
  }

  onLogin(userLoginDetails: ILoginModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(
      environment.API_URL + Constants.API_END_POINTS.LOGIN,
      userLoginDetails,
    );
  }
}
