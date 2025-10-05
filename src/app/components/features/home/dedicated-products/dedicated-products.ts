import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Product} from '../../../../core/models/Product';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-dedicated-products',
  imports: [
    NgOptimizedImage,
    TranslatePipe
  ],
  templateUrl: './dedicated-products.html',
  styleUrl: './dedicated-products.css'
})
export class DedicatedProducts {
  @ViewChild('carouselTrack', { static: true }) carouselTrack?: ElementRef<HTMLUListElement>;

  products : Product[] = [
   {
     id: 'p1',
     name: 'Smartwatch Pro X200',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 899.99
   },
   {
     id: 'p2',
     name: 'Wireless Headphones Max',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 1299.00
   },
   {
     id: 'p3',
     name: '4K Ultra HD TV 55"',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 2999.00
   },
   {
     id: 'p4',
     name: 'Mechanical Keyboard RGB',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 499.50
   },
   {
     id: 'p5',
     name: 'Gaming Mouse UltraSpeed',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 249.99
   },
   {
     id: 'p6',
     name: 'Portable Bluetooth Speaker',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 399.00
   },
   {
     id: 'p7',
     name: 'Drone AirCam 4K',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 1899.00
   },
   {
     id: 'p8',
     name: 'Laptop Gaming Beast 17"',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 7499.00
   },
   {
     id: 'p9',
     name: 'Wireless Charging Pad Pro',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 199.99
   },
   {
     id: 'p10',
     name: 'Smart Home Hub 2.0',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 999.00
   }
  ];

  translateX: number = 0;
  itemWidth: number = 0;
  visibleCount: number = 5;
  activeIndex: number = 0;

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && this.carouselTrack) {
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
    this.visibleCount = Math.floor(containerWidth / this.itemWidth) || 1;

    const maxActiveIndex = this.products.length - this.visibleCount;
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
    this.activeIndex = Math.min(this.activeIndex + 1, this.products.length - this.visibleCount);
    this.translateX = this.activeIndex * this.itemWidth;
  }
}
