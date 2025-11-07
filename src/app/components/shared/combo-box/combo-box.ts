import {
  Component,
  ContentChild, ElementRef,
  HostBinding,
  inject,
  input, OnDestroy, OnInit,
  output,
  signal,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {isPlatformBrowser, NgTemplateOutlet} from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-combo-box',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './combo-box.html',
  styleUrl: './combo-box.css',
  encapsulation: ViewEncapsulation.None
})
export class ComboBox implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = 'combo-container';

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private elementRef = inject(ElementRef);

  readonly items = input<{ key: string; value: string}[]>([]);
  readonly selectedItem = input<{ key: string; value: string } | null>(null);

  readonly isOpen = signal<boolean>(false);

  readonly selected = signal<{ key: string; value: string } | null>(null);
  readonly selectedChange = output<{ key: string; value: string}>();

  private platformId = inject(PLATFORM_ID);

  private closeDropdownHandler = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  };

  private globalCloseHandler = () => {
    this.isOpen.set(false);
  };

  toggleDropdown() {
    window.dispatchEvent(new CustomEvent('close-all-combos'));
    this.isOpen.set(!this.isOpen());
  }

  chooseItem(item: { key: string; value: string }) {
    this.selected.set(item);
    this.selectedChange.emit(item);
    this.isOpen.set(false);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.selectedItem()) {
        this.selected.set(this.selectedItem());
      }
      document.addEventListener('click', this.closeDropdownHandler);
      document.addEventListener('focusin', this.closeDropdownHandler);
      window.addEventListener('close-all-combos', this.globalCloseHandler);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.closeDropdownHandler);
      document.removeEventListener('focusin', this.closeDropdownHandler);
      window.removeEventListener('close-all-combos', this.globalCloseHandler);
    }
  }
}
