import {Component, inject, OnInit, signal} from '@angular/core';
import {Carousel} from '../../shared/carousel/carousel';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {ActivatedRoute} from '@angular/router';
import {Image} from '../../../core/models/Image';

@Component({
  selector: 'app-product-details',
  imports: [
    Carousel,
    Button,
    TranslatePipe,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private productListingService = inject(ProductListingService);
  private route = inject(ActivatedRoute);

  readonly isLg = signal<boolean>(false);
  product = signal<ProductListingDTO | null>(null);
  selectedImage = signal<Image | null>(null);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product'){

      }else if (type === 'Auction'){

      }
      this.productListingService.loadProductListing(validId).subscribe({
        next: product => {
          this.product.set(product);
          for(const image of product.images){
            if(image.imageOrder === 1){
              this.selectedImage.set(image);
              break;
            }
          }
        },
        error: err => console.error(err)
      });
    });
  }

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
      this.isLg.set(result.breakpoints['(min-width: 1024px)']);
    });
  }
}
