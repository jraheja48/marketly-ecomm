import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Toast } from '@src/app/core/toast';
import { ApiResponseModel } from '@src/app/models/api-response-model';
import { IOrder } from '@src/app/models/product-model';
import { Product } from '@src/app/services/product';
import { UserService } from '@src/app/services/user-service';

type OrderStatus = 'Placed' | 'Cancelled';

@Component({
  imports: [RouterLink, CurrencyPipe, DatePipe],
  selector: 'app-my-orders',
  styleUrl: './my-orders.scss',
  templateUrl: './my-orders.html',
})
export class MyOrders {
  userSrv = inject(UserService);
  productSrv = inject(Product);
  private readonly toast = inject(Toast);

  protected readonly orders = signal<IOrder[]>([]);
  protected readonly expandedOrderId = signal<number | null>(null);
  protected readonly cancellingOrderId = signal<number | null>(null);

  constructor() {
    if (this.userSrv.loggedUserData?.custId) {
      this.productSrv
        .getAllOrderByCustId(this.userSrv.loggedUserData.custId)
        .subscribe((res: ApiResponseModel) => {
          this.orders.set(res.data || []);
        });
    }
  }

  protected toggleOrder(saleId: number): void {
    this.expandedOrderId.update((current) => (current === saleId ? null : saleId));
  }

  protected orderStatus(order: IOrder): OrderStatus {
    return order.isCanceled ? 'Cancelled' : 'Placed';
  }

  protected statusClass(status: OrderStatus): string {
    return {
      Placed: 'status-delivered',
      Cancelled: 'status-cancelled',
    }[status];
  }

  protected formatAddress(order: IOrder): string {
    return [
      order.deliveryAddress1,
      order.deliveryAddress2,
      order.deliveryCity,
      order.deliveryPinCode,
    ]
      .filter((part) => !!part)
      .join(', ');
  }

  protected canCancel(order: IOrder): boolean {
    return !order.isCanceled;
  }

  protected onCancelOrder(order: IOrder, event: Event): void {
    event.stopPropagation();
    this.cancellingOrderId.set(order.saleId);
    this.productSrv.cancelOrder(order.saleId).subscribe({
      next: (response: ApiResponseModel) => {
        this.cancellingOrderId.set(null);
        if (response.result) {
          this.orders.update((orders) =>
            orders.map((o) => (o.saleId === order.saleId ? { ...o, isCanceled: true } : o)),
          );
          this.toast.show('Order cancelled successfully.', 'success');
        } else {
          this.toast.show('Failed to cancel order: ' + response.message, 'danger');
        }
      },
      error: (error) => {
        this.cancellingOrderId.set(null);
        console.error('Error cancelling order:', error);
        this.toast.show(
          'Something went wrong while cancelling your order. Please try again.',
          'danger',
        );
      },
    });
  }
}
