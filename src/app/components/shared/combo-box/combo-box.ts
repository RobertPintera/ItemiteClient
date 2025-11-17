import {
  Component,
  ContentChild, ElementRef,
  HostBinding,
  inject,
  input, model, OnDestroy, OnInit,
  output,
  signal,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {isPlatformBrowser, NgTemplateOutlet} from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {OptionItem} from '../../../core/models/OptionItem';

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
  private platformId = inject(PLATFORM_ID);

  readonly items = input<OptionItem[]>([]);
  readonly selectedItem = model<OptionItem>();
  readonly selectedItemChange = output<OptionItem>();
  readonly isOpen = signal(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.closeDropdownHandler);
      document.addEventListener('focusin', this.closeDropdownHandler);
      window.addEventListener('close-all-combos', this.globalCloseDropdownHandler);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.closeDropdownHandler);
      document.removeEventListener('focusin', this.closeDropdownHandler);
      window.removeEventListener('close-all-combos', this.globalCloseDropdownHandler);
    }
  }

  toggleDropdown() {
    window.dispatchEvent(new CustomEvent('close-all-combos'));
    this.isOpen.set(!this.isOpen());
  }

  chooseItem(item: OptionItem) {
    this.selectedItem.set(item);
    this.isOpen.set(false);
    this.selectedItemChange.emit(item);
  }

  private closeDropdownHandler = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  };

  private globalCloseDropdownHandler = () => {
    this.isOpen.set(false);
  };
}
