import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Footer } from './shared/footer/footer';
import { Theme, ThemePreference } from './core/theme';
import { IRegisterModel } from './models/user-model';
import { Constants } from './constants/Constanct';
import { UserService } from './services/user-service';
import { AvatarTransformPipe } from './pipes/avatar-transform-pipe';

interface CartLineItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const FOOTERLESS_ROUTES = ['/login', '/checkout'];

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Footer, AvatarTransformPipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly theme = inject(Theme);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  public loggedUserData!: IRegisterModel | undefined;

  protected readonly searchTerm = signal('');

  protected readonly cartItems = signal<CartLineItem[]>([
    { id: 1, name: 'Wireless Headphones', price: 79, qty: 1 },
    { id: 2, name: 'Canvas Backpack', price: 45, qty: 2 },
  ]);

  protected readonly cartItemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.qty, 0),
  );

  protected readonly cartSubtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.qty, 0),
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
    this.readLoggedData();
    this.userService.onLogin$.subscribe(() => {
      this.readLoggedData();
    });
  }

  protected readLoggedData(): void {
    const loggedUserData = localStorage.getItem(Constants.LOGIN_STORAGE_KEY);
    if (loggedUserData) {
      this.loggedUserData = JSON.parse(loggedUserData);
    }
  }

  protected onLogout(): void {
    localStorage.removeItem(Constants.LOGIN_STORAGE_KEY);
    this.loggedUserData = undefined;
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
