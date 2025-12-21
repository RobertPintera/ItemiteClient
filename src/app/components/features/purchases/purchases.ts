import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Loader} from '../../shared/loader/loader';
import {Paginator} from '../../shared/paginator/paginator';
import {PaginatedListingDTO} from '../../../core/models/PaginatedListingDTO';
import {GetPurchasesDTO} from '../../../core/models/payments/GetPurchasesDTO';
import {GetPurchasesResponseDTO} from '../../../core/models/payments/GetPurchasesResponseDTO';
import {debounceTime, finalize, Subject, switchMap, takeUntil} from 'rxjs';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {ActivatedRoute, Router} from '@angular/router';
import {LISTING_TYPES} from '../../../core/constants/constants';
import {PurchaseItem} from './purchase-item/purchase-item';

@Component({
  selector: 'app-purchases',
  imports: [
    TranslatePipe,
    Loader,
    Paginator,
    PurchaseItem
  ],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases implements OnInit, OnDestroy {
  private paymentsService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly loading = signal<boolean>(true);
  readonly purchases = signal<GetPurchasesResponseDTO | null>(null);

  readonly totalPages = computed(() => this.purchases()?.totalPages ?? 0);

  readonly filter = signal<GetPurchasesDTO>({
    pageSize: 10,
    pageNumber: 1,
  });
  readonly isBlocked = signal<boolean>(false);

  private filterPageSubject = new Subject<PaginatedListingDTO>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.filterPageSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        return this.paymentsService.loadPurchases(filter).pipe(
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
        this.purchases.set(data);
      },
    });

    this.route.queryParamMap.subscribe(params => {
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

  usePaginator(pageNumber: number): void {
    this.filter().pageNumber = pageNumber;

    this.router.navigate([], {
      queryParams: {
        pageNumber: pageNumber,
      },
      queryParamsHandling: 'merge'
    });

    this.applyFilter(this.filter());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyFilter(filter: PaginatedListingDTO) {
    this.isBlocked.set(true);
    this.filterPageSubject.next(filter);
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
