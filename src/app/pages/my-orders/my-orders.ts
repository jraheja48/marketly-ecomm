import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type OrderStatus = 'Delivered' | 'In Transit' | 'Cancelled';

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
}

@Component({
  imports: [RouterLink],
  selector: 'app-my-orders',
  styleUrl: './my-orders.scss',
  templateUrl: './my-orders.html',
})
export class MyOrders {
  protected readonly orders: Order[] = [
    { id: '#10234', date: 'Sep 12, 2026', status: 'Delivered', total: 158, itemCount: 3 },
    { id: '#10198', date: 'Aug 30, 2026', status: 'In Transit', total: 79, itemCount: 1 },
    { id: '#10142', date: 'Aug 04, 2026', status: 'Cancelled', total: 45, itemCount: 1 },
  ];

  protected readonly expandedOrderId = signal<string | null>(null);

  protected toggleOrder(id: string): void {
    this.expandedOrderId.update((current) => (current === id ? null : id));
  }

  protected statusClass(status: OrderStatus): string {
    return {
      Delivered: 'status-delivered',
      'In Transit': 'status-transit',
      Cancelled: 'status-cancelled',
    }[status];
  }
}
