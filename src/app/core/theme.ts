import { Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'marketly-theme';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  readonly preference = signal<ThemePreference>(this.readStoredPreference());
  readonly effective = signal<EffectiveTheme>(this.resolve(this.preference()));

  constructor() {
    this.apply(this.effective());
    this.media.addEventListener('change', () => {
      if (this.preference() === 'system') {
        this.effective.set(this.resolve('system'));
        this.apply(this.effective());
      }
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
    localStorage.setItem(STORAGE_KEY, preference);
    this.effective.set(this.resolve(preference));
    this.apply(this.effective());
  }

  private resolve(preference: ThemePreference): EffectiveTheme {
    if (preference === 'system') {
      return this.media.matches ? 'dark' : 'light';
    }
    return preference;
  }

  private apply(theme: EffectiveTheme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }

  private readStoredPreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
