import {Component, inject, OnInit, signal} from '@angular/core';
import {Carousel} from '../../shared/carousel/carousel';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {ActivatedRoute} from '@angular/router';
import {Image} from '../../../core/models/Image';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';

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
  private auctionListingService = inject(AuctionListingService);
  private route = inject(ActivatedRoute);

  readonly isLg = signal<boolean>(false);
  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly selectedImage = signal<Image | null>(null);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product'){
        this.productListingService.loadProductListing(validId).subscribe({
          next: product => {
            this.article.set(product);
            for(const image of product.images){
              if(image.imageOrder === 1){
                this.selectedImage.set(image);
                break;
              }
            }
          },
          error: err => console.error(err)
        });
      }else if (type === 'Auction'){
        this.auctionListingService.loadAuctionListing(validId).subscribe({
          next: product => {
            this.article.set(product);
            for(const image of product.images){
              if(image.imageOrder === 1){
                this.selectedImage.set(image);
                break;
              }
            }
          },
          error: err => console.error(err)
        });
      }
    });
  }

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
      this.isLg.set(result.breakpoints['(min-width: 1024px)']);
    });
  }

}
