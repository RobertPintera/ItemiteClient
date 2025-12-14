import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  private _platformId = inject(PLATFORM_ID);

  SetItem(key: string, value: any): void {
    if(!isPlatformBrowser(this._platformId)) return;
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to local storage', error);
    }
  }

  GetItem<T>(key: string): T | undefined {
    if(!isPlatformBrowser(this._platformId)) return;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  RemoveItem(key: string): void {
    if(!isPlatformBrowser(this._platformId)) return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if(!isPlatformBrowser(this._platformId)) return;
    localStorage.clear();
  }
}
