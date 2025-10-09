import {Component, computed, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AuctionProduct} from '../../../../core/models/AuctionProduct';
import {AuctionProductCard} from '../cards/auction-product-card/auction-product-card';

@Component({
  selector: 'app-auctions',
  imports: [
    TranslatePipe,
    AuctionProductCard
  ],
  templateUrl: './auctions.html',
  styleUrl: './auctions.css'
})
export class Auctions {
  products = signal<AuctionProduct[]>([
    {
      id: 'p1',
      name: 'Smartwatch Pro X200',
      image: 'assets/laptop_chromebook_icon.svg',
      biddersNumber: 5,
      highestPrice: 899.99,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    {
      id: 'p2',
      name: 'Wireless Headphones Max',
      image: 'assets/laptop_chromebook_icon.svg',
      biddersNumber: 2,
      highestPrice: 1299.0,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }
  ]);

  firstProduct = computed(() => this.products().at(0));
  secondProduct = computed(() => this.products().at(1));
}
