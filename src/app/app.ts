import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Footer } from './shared/footer/footer';
import { Theme, ThemePreference } from './core/theme';
import { Toast } from './core/toast';
import { IRegisterModel } from './models/user-model';
import { Constants } from './constants/Constanct';
import { UserService } from './services/user-service';
import { AvatarTransformPipe } from './pipes/avatar-transform-pipe';
import { Product } from './services/product';
import { ICartList } from './models/product-model';
import { ApiResponseModel } from './models/api-response-model';

const FOOTERLESS_ROUTES = ['/login', '/checkout'];

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Footer, AvatarTransformPipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  @ViewChild('toastEl') private toastElRef!: ElementRef<HTMLElement>;

  protected readonly theme = inject(Theme);
  protected readonly toast = inject(Toast);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly productService = inject(Product);

  public loggedUserData!: IRegisterModel | undefined;

  protected readonly cartList = signal<ICartList[]>([]);
  protected readonly searchTerm = signal('');

  protected readonly cartItemCount = computed(() =>
    this.cartList().reduce((total, item) => total + item.quantity, 0),
  );

  protected readonly cartSubtotal = computed(() =>
    this.cartList().reduce((total, item) => total + item.productPrice * item.quantity, 0),
  );

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly showFooter = computed(
    () => !FOOTERLESS_ROUTES.includes(this.currentUrl().split('?')[0]),
  );

  protected readonly themeOptions: { value: ThemePreference; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'bi-sun' },
    { value: 'dark', label: 'Dark', icon: 'bi-moon-stars' },
    { value: 'system', label: 'System', icon: 'bi-circle-half' },
  ];

  constructor() {
    this.loggedUserData = this.userService.loggedUserData;
    this.getCartData();
    this.userService.onLogin$.subscribe(() => {
      this.loggedUserData = this.userService.loggedUserData;
      this.getCartData();
    });
    this.userService.onAddToCart$.subscribe(() => {
      this.getCartData();
    });
    this.userService.onOrderPlaced$.subscribe(() => {
      this.cartList.set([]);
    });
  }

  ngAfterViewInit(): void {
    this.toast.registerElement(this.toastElRef.nativeElement);
  }

  getCartData(): void {
    if (this.loggedUserData?.custId) {
      this.productService.getCartsByCustId(this.loggedUserData?.custId).subscribe({
        next: (response: ApiResponseModel) => this.cartList.set(response.data || []),
        error: (error) => {
          this.cartList.set([]);
          console.error('Error fetching cart data:', error);
        },
      });
    }
  }

  onDeleteItemFromCart(item: ICartList): void {
    this.productService.DeleteProductFromCartById(item.cartId).subscribe({
      next: (response: ApiResponseModel) => {
        if (response.result) {
          this.toast.show('Item removed from cart successfully!', 'success');
          this.getCartData();
        } else {
          this.toast.show('Failed to remove item from cart: ' + response.message, 'danger');
        }
      },
      error: (error) => {
        this.toast.show('An error occurred while removing the item from cart.', 'danger');
      },
    });
  }

  protected onLogout(): void {
    localStorage.removeItem(Constants.LOGIN_STORAGE_KEY);
    this.loggedUserData = undefined;
    this.cartList.set([]);
    this.router.navigate(['/home']);
  }

  protected setTheme(preference: ThemePreference): void {
    this.theme.setPreference(preference);
  }

  protected onSearchSubmit(): void {
    const term = this.searchTerm().trim();
    this.router.navigate(['/products'], term ? { queryParams: { q: term } } : {});
  }
}
