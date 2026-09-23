import { Injectable, signal } from '@angular/core';

// bootstrap.bundle.min.js is loaded globally (see angular.json "scripts"),
// the same script that already drives the navbar's offcanvas/dropdown/modal —
// this just gives TypeScript a type for the global it exposes.
declare const bootstrap: any;

export type ToastVariant = 'success' | 'danger';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  readonly message = signal('');
  readonly variant = signal<ToastVariant>('success');

  private toastEl?: HTMLElement;

  registerElement(el: HTMLElement): void {
    this.toastEl = el;
  }

  show(message: string, variant: ToastVariant): void {
    this.message.set(message);
    this.variant.set(variant);
    if (!this.toastEl) {
      return;
    }
    // Defer to the next tick so Angular flushes the [class.text-bg-*] binding
    // to the DOM first — calling bootstrap's show() synchronously here can
    // race Bootstrap's fade-in reflow against Angular's own render pass and
    // leave the toast stuck at opacity: 0.
    setTimeout(() => {
      bootstrap.Toast.getOrCreateInstance(this.toastEl!).show();
    });
  }
}
