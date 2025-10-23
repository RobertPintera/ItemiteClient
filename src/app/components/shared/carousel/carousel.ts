import {
  AfterViewInit,
  Component,
  computed,
  ContentChild,
  ElementRef, HostBinding,
  input, OnDestroy, signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';

/**
 * Carousel component
 *
 * @description
 * Displays a horizontal carousel of items with configurable visible counts per screen size.
 * Supports navigation via arrows and automatically hides them if all items fit in the visible area.
 *
 * The component accepts a template via `<ng-template>` to render each item.
 *
 * @example
 * <app-carousel
 *   [items]="products" [hideArrows]="false"
 *   [visibleSSm]="1" [visibleSm]="2"
 *   [visibleMd]="3" [visibleLg]="4"
 *   [visibleXl]="5" [visible2xl]="6">
 *   <ng-template let-product>
 *     <div>{{ product.name }}</div>
 *   </ng-template>
 * </app-carousel>
 *
 * @inputs
 * - `items: any[]` – Array of items to display in the carousel.
 * - `hideArrows: boolean` – Whether to hide navigation arrows entirely.
 * - `visibleSSm: number` – Number of visible items for extra small screens.
 * - `visibleSm: number` – Number of visible items for small screens (≥ 640px).
 * - `visibleMd: number` – Number of visible items for medium screens (≥ 768px).
 * - `visibleLg: number` – Number of visible items for large screens (≥ 1024px).
 * - `visibleXl: number` – Number of visible items for extra large screens (≥ 1280px).
 * - `visible2xl: number` – Number of visible items for 2xl screens (≥ 1536px).
 */
@Component({
  selector: 'app-carousel',
  imports: [
    CommonModule
  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel implements AfterViewInit, OnDestroy {
  @HostBinding('class') hostClass = 'w-full';

  @ViewChild('carouselTrack', { static: true }) carouselTrack?: ElementRef<HTMLUListElement>;
  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  readonly items = input.required<Record<string, unknown>[]>();
  readonly hideArrows = input<boolean>(false);
  readonly visibleSSm = input<number>(1);
  readonly visibleSm = input<number | undefined>();
  readonly visibleMd = input<number | undefined>();
  readonly visibleLg = input<number | undefined>();
  readonly visibleXl = input<number | undefined>();
  readonly visible2xl = input<number | undefined>();

  readonly itemsWithId = computed(() =>
    this.items()?.map((item, index) => ({
      id: item.id ?? index,
      ...item
    })) ?? []
  );

  translateX = 0;
  itemWidth = signal<number>(0);
  visibleCount = 3;
  activeIndex = 0;
  hideArrowsOnButtons = signal<boolean>(false);

  private mql?: MediaQueryList;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    if (typeof window === 'undefined' || !this.carouselTrack || !this.templateRef) return;

    const screenWidth = window.screen.availWidth - 1;

    this.mql = window.matchMedia(`(max-width: ${screenWidth}px)`);
    this.mql.addEventListener('change', this.handler);

    this.resizeObserver = new ResizeObserver(() => {
      this.updateDom();
    });

    const parent = this.carouselTrack.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver.observe(parent);
    }

    setTimeout(() => {
      this.updateDom();
    },0);
  }

  ngOnDestroy() {
    if (this.mql) this.mql.removeEventListener('change', this.handler);
    this.resizeObserver?.disconnect();
  }

  private handler = (_e: MediaQueryListEvent) => {
    this.updateDom();
  };

  updateDom(){
    this.updateVisibleCount();
    this.updateArrowVisibility();
    this.calculateSizes();
  }

  calculateSizes() {
    if (!this.carouselTrack) return;

    const containerWidth = this.carouselTrack.nativeElement.parentElement?.getBoundingClientRect().width || 0;

    this.itemWidth.set(containerWidth / this.visibleCount);

    const maxActiveIndex = this.itemsWithId().length - this.visibleCount;
    if (this.activeIndex > maxActiveIndex) {
      this.activeIndex = maxActiveIndex >= 0 ? maxActiveIndex : 0;
    }

    this.translateX = this.activeIndex * this.itemWidth();
  }

  updateArrowVisibility() {
    if (!this.carouselTrack) return;

    if (this.hideArrows()) return;

    this.hideArrowsOnButtons.set(this.itemsWithId().length <= this.visibleCount);
  }

  updateVisibleCount() {
    if (!this.carouselTrack) return;

    const width = window.innerWidth;

    const sSm = this.visibleSSm() ?? 1;
    const sm = this.visibleSm() ?? sSm;
    const md = this.visibleMd() ?? sm;
    const lg = this.visibleLg() ?? md;
    const xl = this.visibleXl() ?? lg;
    const x2l = this.visible2xl() ?? xl;

    if (width < 640) this.visibleCount = sSm;
    else if (width < 768) this.visibleCount = sm;
    else if (width < 1024) this.visibleCount = md;
    else if (width < 1280) this.visibleCount = lg;
    else if (width < 1536) this.visibleCount = xl;
    else this.visibleCount = x2l;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
    this.translateX = Math.max(this.activeIndex * this.itemWidth(), 0);
  }

  next() {
    this.activeIndex = Math.min(this.activeIndex + 1, this.itemsWithId().length - this.visibleCount);
    this.translateX = this.activeIndex * this.itemWidth();
  }
}
