import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Loader} from "../../shared/loader/loader";
import {Paginator} from "../../shared/paginator/paginator";
import {ProductItem} from "../../shared/product-item/product-item";
import {TranslatePipe} from "@ngx-translate/core";
import {BreakpointObserver} from '@angular/cdk/layout';
import {UserService} from '../../../core/services/user-service/user.service';
import {ListingService} from '../../../core/services/listing-service/listing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ListingResponseDTO} from '../../../core/models/ListingResponseDTO';
import {PaginatedListingDTO} from '../../../core/models/PaginatedListingDTO';
import {catchError, debounceTime, finalize, of, Subject, switchMap, takeUntil} from 'rxjs';
import {LISTING_TYPES, ListingType} from '../../../core/constants/constants';

@Component({
  selector: 'app-followed-products',
  imports: [
    Loader,
    Paginator,
    ProductItem,
    TranslatePipe
  ],
  templateUrl: './followed-products.html',
  styleUrl: './followed-products.css'
})
export class FollowedProducts implements OnInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _listingService = inject(ListingService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  readonly isMd = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly listings = signal<ListingResponseDTO | null>(null);

  readonly totalPages = computed(() => this.listings()?.totalPages ?? 0);

  readonly filter = signal<PaginatedListingDTO>({
    pageSize: 10,
    pageNumber: 1,
  });
  readonly isBlocked = signal<boolean>(false);

  private _filterPageSubject = new Subject<PaginatedListingDTO>();
  private _destroy$ = new Subject<void>();

  ngOnInit() {
    this._breakpointObserver.observe([
      '(min-width: 768px)',
    ]).subscribe(result => {
      this.isMd.set(result.breakpoints['(min-width: 768px)']);
    });


    this._filterPageSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        return this._listingService.loadFollowedListing(filter).pipe(
          catchError(err => {
            console.error('Error loading listings:', err);
            return of(null);
          }),
          finalize(() => {
            setTimeout(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            }, 500);
          })
        );
      }),
      takeUntil(this._destroy$)
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.listings.set(data);
      },
    });

    this._route.queryParamMap.subscribe(params => {
      const updated: Partial<PaginatedListingDTO> = {};

      const num = (name: string) => {
        const v = params.get(name);
        return v !== null ? Number(v) : null;
      };

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;

      const newFilter = { ...this.filter(), ...updated };

      this.filter.set(newFilter);

      this.applyFilter(this.filter());
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  usePaginator(pageNumber: number): void {
    this.filter().pageNumber = pageNumber;

    this._router.navigate([], {
      queryParams: {
        pageNumber: pageNumber,
      },
      queryParamsHandling: 'merge'
    });

    this.applyFilter(this.filter());
  }

  goToProductForm(listingType?: ListingType) {
    this._router.navigate(['/product-form'], {
      queryParams: { type: listingType }
    });
  }

  private applyFilter(filter: PaginatedListingDTO) {
    this.isBlocked.set(true);
    this._filterPageSubject.next(filter);
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
