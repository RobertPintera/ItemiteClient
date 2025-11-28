import {
  Component,
  ContentChild,
  ElementRef, forwardRef,
  HostBinding,
  inject, Input,
  input, model, OnDestroy, OnInit,
  output, PLATFORM_ID,
  signal,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {SelectNode} from '../../../core/models/SelectNode';
import {isPlatformBrowser, NgTemplateOutlet} from '@angular/common';
import {OptionItem} from '../../../core/models/OptionItem';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/* eslint-disable @typescript-eslint/no-empty-function */
@Component({
  selector: 'app-cascade-select',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './cascade-select.html',
  styleUrl: './cascade-select.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CascadeSelect,
      multi: true
    }
  ]
})
export class CascadeSelect implements OnInit, OnDestroy, ControlValueAccessor {
  @HostBinding('class') hostClass = 'cascade-container';
  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  readonly items = input<SelectNode[]>();
  readonly selectedItem = model<OptionItem>();
  readonly selectedItemChange = output<OptionItem>();

  readonly isDisabled = signal<boolean>(false);
  readonly isOpen = signal(false);

  private onChange: (value: OptionItem | null) => void = () => {};
  private onTouched: () => void = () => {};

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
    if(this.isDisabled()) return;

    window.dispatchEvent(new CustomEvent('close-all-combos'));
    this.isOpen.set(!this.isOpen());
    this.onTouched();

    if (this.isOpen()) {
      this.collapseAll(this.items());
    }
  }

  onNodeClick(node: SelectNode) {
    if (node.childrenNodes?.length) {
      node.expanded = !node.expanded;
      return;
    }

    this.selectedItem.set(node.option);
    this.isOpen.set(false);
    this.selectedItemChange.emit(node.option);
    this.onChange(node.option);
    this.onTouched();
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

  private collapseAll(nodes?: SelectNode[]) {
    if (!nodes) return;

    for (const node of nodes) {
      node.expanded = false;
      if (node.childrenNodes?.length) this.collapseAll(node.childrenNodes);
    }
  }

  // ------ forms -----
  writeValue(value: OptionItem | null): void {
    this.selectedItem.set(value ?? undefined);
  }

  registerOnChange(fn: (value: OptionItem | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  // -------------------
}
