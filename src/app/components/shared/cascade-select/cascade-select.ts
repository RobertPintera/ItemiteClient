import {
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  inject,
  input, model, OnDestroy, OnInit,
  output, PLATFORM_ID,
  signal,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {SelectNode} from '../../../core/models/SelectNode';
import {isPlatformBrowser, NgTemplateOutlet} from '@angular/common';
import {OptionItem} from '../../../core/models/OptionItem';

@Component({
  selector: 'app-cascade-select',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './cascade-select.html',
  styleUrl: './cascade-select.css',
  encapsulation: ViewEncapsulation.None
})
export class CascadeSelect implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = 'cascade-container';
  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  readonly items = input<SelectNode[]>();
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
}
