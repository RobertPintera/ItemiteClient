import {
  Component,
  computed,
  ContentChild,
  ElementRef, HostBinding,
  HostListener,
  input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
  @HostBinding('class')
  hostClass = 'w-full';

  @ViewChild('carouselTrack', { static: true }) carouselTrack?: ElementRef<HTMLUListElement>;
  @ContentChild(TemplateRef) templateRef?: TemplateRef<any>;

  readonly items = input<any[]>([]);
  readonly itemsWithId = computed(() =>
    this.items()?.map((item, index) => ({
      id: item.id ?? index,
      ...item
    })) ?? []
  );

  translateX: number = 0;
  itemWidth: number = 0;
  visibleCount: number = 5;
  activeIndex: number = 0;

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && this.carouselTrack && this.templateRef) {
      const screenWidth = window.screen.availWidth - 1;

      this.mql = window.matchMedia(`(max-width: ${screenWidth}px)`);
      this.mql.addEventListener('change', this.handler);

      setTimeout(() => this.calculateSizes());
    }
  }

  ngOnDestroy() {
    if (this.mql) this.mql.removeEventListener('change', this.handler);
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateSizes();
  }

  private mql!: MediaQueryList;
  private handler = (e: MediaQueryListEvent) => {
    this.calculateSizes();
  };

  calculateSizes() {
    if (!this.carouselTrack) return;
    const firstItem = this.carouselTrack.nativeElement.querySelector('li');

    if (!firstItem) return;
    this.itemWidth = firstItem.getBoundingClientRect().width;

    const containerWidth = this.carouselTrack.nativeElement.parentElement?.getBoundingClientRect().width || 0;
    this.visibleCount = Math.round(containerWidth / this.itemWidth) || 1;

    const maxActiveIndex = this.itemsWithId().length - this.visibleCount;
    if (this.activeIndex > maxActiveIndex) {
      this.activeIndex = maxActiveIndex >= 0 ? maxActiveIndex : 0;
    }
    this.translateX = this.activeIndex * this.itemWidth;
  }

  prev() {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
    this.translateX = Math.max(this.translateX - this.itemWidth, 0);
  }

  next() {
    this.activeIndex = Math.min(this.activeIndex + 1, this.itemsWithId().length - this.visibleCount);
    this.translateX = this.activeIndex * this.itemWidth;
  }
}
