import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, finalize, Subject, switchMap, takeUntil} from 'rxjs';
import {PaginatedListingDTO} from '../../../core/models/PaginatedListingDTO';
import {GetSalesResponseDTO} from '../../../core/models/payments/GetSalesResponseDTO';
import {GetSalesDTO} from '../../../core/models/payments/GetSalesDTO';
import {LISTING_TYPES} from '../../../core/constants/constants';
import {Loader} from '../../shared/loader/loader';
import {Paginator} from '../../shared/paginator/paginator';
import {TranslatePipe} from '@ngx-translate/core';
import {SaleItem} from './sale-item/sale-item';

@Component({
  selector: 'app-sales',
  imports: [
    Loader,
    Paginator,
    TranslatePipe,
    SaleItem
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales implements OnInit, OnDestroy {
  private paymentsService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly loading = signal<boolean>(true);
  readonly sales = signal<GetSalesResponseDTO | null>(null);

  readonly totalPages = computed(() => this.sales()?.totalPages ?? 0);

  readonly filter = signal<GetSalesDTO>({
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
        return this.paymentsService.loadSales(filter).pipe(
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
        this.sales.set(data);
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
