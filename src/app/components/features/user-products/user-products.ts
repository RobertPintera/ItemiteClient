import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Paginator} from '../../shared/paginator/paginator';
import {Button} from '../../shared/button/button';
import {Loader} from '../../shared/loader/loader';
import {ListingResponseDTO} from '../../../core/models/listing-general/ListingResponseDTO';
import {ListingService} from '../../../core/services/listing-service/listing.service';
import {debounceTime, finalize,Subject, switchMap, takeUntil} from 'rxjs';
import {PaginatedListingDTO} from '../../../core/models/listing-general/PaginatedListingDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Dialog} from '../../shared/dialog/dialog';
import {LISTING_TYPES, ListingType} from '../../../core/constants/constants';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductItem} from '../../shared/product-item/product-item';
import {UserService} from '../../../core/services/user-service/user.service';

@Component({
  selector: 'app-user-products',
  imports: [
    Paginator,
    Button,
    Loader,
    Dialog,
    TranslatePipe,
    ProductItem
  ],
  templateUrl: './user-products.html',
  styleUrl: './user-products.css'
})
export class UserProducts implements OnInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _userService = inject(UserService);
  private _listingService = inject(ListingService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  readonly isMd = signal<boolean>(false);
  readonly isOpenDialog = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly listings = signal<ListingResponseDTO | null>(null);

  readonly totalPages = computed(() => this.listings()?.totalPages ?? 0);

  readonly filter = signal<PaginatedListingDTO>({
    pageSize: 10,
    pageNumber: 1,
  });
  readonly isBlocked = signal<boolean>(false);

  private filterPageSubject = new Subject<PaginatedListingDTO>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this._breakpointObserver.observe([
      '(min-width: 768px)',
    ]).subscribe(result => {
      this.isMd.set(result.breakpoints['(min-width: 768px)']);
    });


    this.filterPageSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        return this._listingService.loadUserListings(this._userService.userBasicInfo().id, filter).pipe(
          finalize(() => {
            setTimeout(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            }, 500);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.listings.set(data);
      },
    });

    this._route.queryParamMap.subscribe(params => {
      const updated: Partial<PaginatedListingDTO> = {};

      const num = (name: string) => {
        const value = params.get(name);
        return value !== null ? Number(value) : null;
      };

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;

      const newFilter = { ...this.filter(), ...updated };

      this.filter.set(newFilter);

      this.applyFilter(this.filter());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  openDialog(){
    this.isOpenDialog.set(true);
  }

  closeDialog() {
    this.isOpenDialog.set(false);
  }

  goToProductForm(listingType?: ListingType) {
    this._router.navigate(['/product-form'], {
      queryParams: { type: listingType }
    });
  }

  private applyFilter(filter: PaginatedListingDTO) {
    this.isBlocked.set(true);
    this.filterPageSubject.next(filter);
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
