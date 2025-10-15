import {Component, inject, input, output, signal} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-combo-box',
  imports: [],
  templateUrl: './combo-box.html',
  styleUrl: './combo-box.css'
})
export class ComboBox {
  readonly items = input<{ key: string; value: string}[]>([]);
  readonly selectedItem = input<{ key: string; value: string } | null>(null);

  readonly isOpen = signal<boolean>(false);

  readonly selected = signal<{ key: string; value: string } | null>(null);
  readonly selectedChange = output<{ key: string; value: string}>();

  private platformId = inject(PLATFORM_ID);

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  chooseItem(item: { key: string; value: string }) {
    this.selected.set(item);
    this.selectedChange.emit(item);
    this.isOpen.set(false);
  }

  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.combo-container')) {
      this.isOpen.set(false);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.selectedItem()) {
        this.selected.set(this.selectedItem());
      }
      document.addEventListener('click', this.closeDropdown.bind(this));
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.closeDropdown.bind(this));
    }
  }
}
