import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild, effect,
  ElementRef,
  HostBinding,
  input, OnDestroy,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Image} from '../../../core/models/Image';
import {NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements AfterContentInit, AfterViewInit, OnDestroy {
  @HostBinding('class') hostClass = 'w-full';

  @ViewChild('galleryTrack', { static: true }) galleryTrack?: ElementRef<HTMLUListElement>;
  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;
  @ViewChild('defaultTemplate', {static: true}) defaultTemplate!: TemplateRef<unknown>;

  readonly images = input.required<Image[]>();
  readonly hideArrows = input<boolean>(false);
  readonly visibleSSm = input<number>(1);
  readonly visibleSm = input<number | undefined>();
  readonly visibleMd = input<number | undefined>();
  readonly visibleLg = input<number | undefined>();
  readonly visibleXl = input<number | undefined>();
  readonly visible2xl = input<number | undefined>();

  readonly selectedImage = signal<Image | null>(null);
  readonly itemWidth = signal<number>(0);
  readonly hideArrowsOnButtons = signal<boolean>(false);

  readonly sortedImages = signal<Image[]>([]);


  translateX = 0;
  visibleCount = 3;
  activeIndex = 0;

  private mql?: MediaQueryList;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const images = this.images();
      const sorted = images.sort((a,b) => a.imageOrder - b.imageOrder);
      this.sortedImages.set(sorted);

      if (sorted.length > 0) {
        this.selectedImage.set(sorted[0]);
      }
    });
  }

  ngAfterContentInit() {
    if (!this.templateRef) {
      this.templateRef = this.defaultTemplate;
    }
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined' || !this.galleryTrack) return;

    const screenWidth = window.screen.availWidth - 1;

    this.mql = window.matchMedia(`(max-width: ${screenWidth}px)`);
    this.mql.addEventListener('change', this.handler);

    this.resizeObserver = new ResizeObserver(() => {
      this.updateDom();
    });

    const parent = this.galleryTrack.nativeElement.parentElement;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handler = (e: MediaQueryListEvent) => {
    this.updateDom();
  };

  updateDom(){
    this.updateVisibleCount();
    this.updateArrowVisibility();
    this.calculateSizes();
  }

  calculateSizes() {
    if (!this.galleryTrack) return;

    const containerWidth = this.galleryTrack.nativeElement.parentElement?.getBoundingClientRect().width || 0;

    this.itemWidth.set(containerWidth / this.visibleCount);

    const maxActiveIndex = this.sortedImages().length - this.visibleCount;
    if (this.activeIndex > maxActiveIndex) {
      this.activeIndex = maxActiveIndex >= 0 ? maxActiveIndex : 0;
    }

    this.translateX = this.activeIndex * this.itemWidth();
  }

  updateArrowVisibility() {
    if (!this.galleryTrack) return;

    if (this.hideArrows()) return;

    this.hideArrowsOnButtons.set(this.sortedImages().length <= this.visibleCount);
  }

  updateVisibleCount() {
    if (!this.galleryTrack) return;

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
    this.activeIndex = Math.min(this.activeIndex + 1, this.sortedImages().length - this.visibleCount);
    this.translateX = this.activeIndex * this.itemWidth();
  }

  selectImage(item: Image) {
    this.selectedImage.set(item);
  }
}
