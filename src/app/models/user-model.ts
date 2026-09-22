export interface IRegisterModel {
  custId: number;
  name: string;
  mobileNo: string;
  password: string;
}

export class RegisterUserClass implements IRegisterModel {
  custId: number;
  name: string;
  mobileNo: string;
  password: string;

  constructor() {
    this.custId = 0;
    this.name = '';
    this.mobileNo = '';
    this.password = '';
  }
}

export interface ILoginModel {
  UserName: string;
  UserPassword: string;
}
