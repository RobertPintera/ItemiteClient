import {
  Component,
  computed,
  ContentChild,
  ElementRef, HostBinding,
  HostListener,
  input, signal,
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

  translateX: number = 0;
  itemWidth = signal<number>(0);
  visibleCount: number = 3;
  activeIndex: number = 0;
  hideArrowsOnButtons = signal<boolean>(false);

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && this.carouselTrack && this.templateRef) {
      const screenWidth = window.screen.availWidth - 1;

      this.mql = window.matchMedia(`(max-width: ${screenWidth}px)`);
      this.mql.addEventListener('change', this.handler);

      setTimeout(() => {
        this.updateDom();
      },0);
    }
  }

  ngOnDestroy() {
    if (this.mql) this.mql.removeEventListener('change', this.handler);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDom();
  }

  private mql?: MediaQueryList;

  private handler = (e: MediaQueryListEvent) => {
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

    const containerWidth = this.carouselTrack.nativeElement.parentElement!.offsetWidth;
    const contentWidth = this.carouselTrack.nativeElement.scrollWidth;
    this.hideArrowsOnButtons.set(contentWidth > containerWidth);
  }

  updateVisibleCount() {
    if (!this.carouselTrack) return;

    const width = this.carouselTrack.nativeElement.parentElement?.offsetWidth || 0;

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
