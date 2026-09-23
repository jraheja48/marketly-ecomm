export interface IProduct {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;
  productShortName: string;
  productDescription: string;
  createdDate: string;
  deliveryTimeSpan: string;
  categoryId: number;
  productImageUrl: string;
  categoryName: string;
}

export interface ICategory {
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
  userId: number;
}

export interface ICartItem {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  addedDate: string;
}

export class addToCart implements ICartItem {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  addedDate: string;

  constructor() {
    this.cartId = 0;
    this.custId = 0;
    this.productId = 0;
    this.quantity = 1;
    this.addedDate = new Date().toISOString();
  }
}

export interface ICartList {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  productShortName: string;
  addedDate: string;
  productName: string;
  categoryName: string;
  productImageUrl: string;
  productPrice: number;
}

export interface IOrder {
  saleId: number;
  custId: number;
  saleDate: string;
  totalInvoiceAmount: number;
  discount: number;
  paymentNaration: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryLandMark: string;
  isCanceled: boolean;
}

export class addToOrder implements IOrder {
  saleId: number;
  custId: number;
  saleDate: string;
  totalInvoiceAmount: number;
  discount: number;
  paymentNaration: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryLandMark: string;
  isCanceled: boolean;

  constructor() {
    this.saleId = 0;
    this.custId = 0;
    this.saleDate = new Date().toISOString();
    this.totalInvoiceAmount = 0;
    this.discount = 0;
    this.paymentNaration = '';
    this.deliveryAddress1 = '';
    this.deliveryAddress2 = '';
    this.deliveryCity = '';
    this.deliveryPinCode = '';
    this.deliveryLandMark = '';
    this.isCanceled = false;
  }
}
