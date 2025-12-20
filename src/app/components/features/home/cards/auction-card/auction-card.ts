import {Component, inject, input, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ListingItemDTO} from '../../../../../core/models/LitstingItemDTO';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrl: './auction-card.css'
})
export class AuctionCard implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  readonly auction = input<ListingItemDTO>();
  readonly isRow = signal<boolean>(false);

  ngOnInit() {
    if (typeof window === 'undefined') return;

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        map(result => {
          const sm = result.breakpoints[Breakpoints.Small] ?? false;
          const lg = result.breakpoints[Breakpoints.Large] ?? false;
          const xl = result.breakpoints[Breakpoints.XLarge] ?? false;

          return (xl && lg) || (!lg && sm);
        })
      )
      .subscribe(value => this.isRow.set(value));
  }
}
