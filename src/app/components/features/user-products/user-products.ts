import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Paginator} from '../../shared/paginator/paginator';
import {Button} from '../../shared/button/button';
import {Loader} from '../../shared/loader/loader';
import {ListingResponseDTO} from '../../../core/models/listing-general/ListingResponseDTO';
import {ListingService} from '../../../core/services/listing-service/listing.service';
import {debounceTime, finalize,Subject, switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Dialog} from '../../shared/dialog/dialog';
import {LISTING_TYPES, ListingType} from '../../../core/constants/constants';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductItem} from '../../shared/product-item/product-item';
import {UserService} from '../../../core/services/user-service/user.service';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {GetUserListingDTO} from '../../../core/models/listing-general/GetUserListingDTO';
import {OptionItem} from '../../../core/models/OptionItem';

@Component({
  selector: 'app-user-products',
  imports: [
    Paginator,
    Button,
    Loader,
    Dialog,
    TranslatePipe,
    ProductItem,
    ComboBox
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
  private _paymentService = inject(PaymentService);
  private isFirstLoad = true;

  readonly onboardingStatus = this._paymentService.onboardingStatus;

  readonly isMd = signal<boolean>(false);
  readonly isOpenDialog = signal<boolean>(false);
  readonly loading = signal<boolean>(true);
  readonly listings = signal<ListingResponseDTO | null>(null);

  readonly totalPages = computed(() => this.listings()?.totalPages ?? 0);

  readonly userInfo = this._userService.userBasicInfo;
  readonly userId = signal<number | null>(null);

  readonly filter = signal<GetUserListingDTO>({
    pageSize: 10,
    pageNumber: 1,
    areArchived: null
  });
  readonly isBlocked = signal<boolean>(false);

  private filterPageSubject = new Subject<GetUserListingDTO>();
  private destroy$ = new Subject<void>();

  readonly listingOptions: OptionItem[] = [
    { key: "-", value: "user_products.options.all" },
    { key: "false", value: "user_products.options.active" },
    { key: "true", value: "user_products.options.archived" },
  ];

  readonly selectedOption = signal<OptionItem>(this.listingOptions[0]);

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
        return this._listingService.loadUserListings(this.userId() ?? this.userInfo().id, filter).pipe(
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
      const updated: Partial<GetUserListingDTO> = {};

      const num = (name: string) => {
        const value = params.get(name);
        return value !== null ? Number(value) : null;
      };
      const str = (name: string) => params.get(name);

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;

      const optionListing = str('areArchived');

      if(optionListing === null){
        updated.areArchived = null;
      } else if(optionListing === "false"){
        updated.areArchived = false;
      } else if(optionListing === "true"){
        updated.areArchived = true;
      }

      this.userId.set(num('id'));

      const newFilter = { ...this.filter(), ...updated };

      this.filter.set(newFilter);

      if(this.isFirstLoad){
        this.isFirstLoad = false;
        this.isBlocked.set(true);
        this.loading.set(true);
        this._listingService.loadUserListings(
          this.userId() ?? this.userInfo().id,
          this.filter()
        ).pipe(
          finalize(() => {
            this.isBlocked.set(false);
            this.loading.set(false);
          })
        ).subscribe(data => {
          this.listings.set(data);
        });
      } else {
        this.applyFilter(this.filter());
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectOption(option?: OptionItem){
    if(!option) return;

    if(option.key === "-"){
      this.updateFilter({areArchived: null });
    } else if(option.key === "false"){
      this.updateFilter({areArchived: false });
    } else if(option.key === "true"){
      this.updateFilter({areArchived: true });
    }
  }

  updateFilter(partial: Partial<GetUserListingDTO>){
    const newFilter = { ...this.filter(), ...partial };

    const hasOtherChanges = Object.keys(partial).some(key => key !== 'pageNumber');

    if (hasOtherChanges) {
      newFilter.pageNumber = 1;
    }

    this.filter.set(newFilter);

    const query = this.serializeFilterToQuery({...newFilter});

    this._router.navigate([], {
      queryParams: query
    });
  }

  usePaginator(pageNumber: number): void {
    this.updateFilter({pageNumber: pageNumber});
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

  private applyFilter(filter: GetUserListingDTO) {
    this.isBlocked.set(true);
    this.filterPageSubject.next(filter);
  }

  private serializeFilterToQuery(filter: GetUserListingDTO): Record<string, string | number | (string | number)[]> {
    const params: Record<string, string | number | (string | number)[]> = {};

    const userId = this.userId();

    if (userId) params['id'] = userId;
    if (filter.areArchived !== null) params['areArchived'] = `${filter.areArchived}`;
    if (filter.pageNumber !== null) params['pageNumber'] = filter.pageNumber;

    return params;
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
