import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Loader} from "../../../../shared/loader/loader";
import {Paginator} from "../../../../shared/paginator/paginator";
import {TranslatePipe} from "@ngx-translate/core";
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {PaginatedPaymentResponseDTO} from '../../../../../core/models/payments/PaginatedPaymentResponseDTO';
import {GetAdminPanelPaymentsLatestDTO} from '../../../../../core/models/payments/GetAdminPanelPaymentsLatestDTO';
import {debounceTime, finalize, Subject, switchMap, takeUntil} from 'rxjs';
import {PaginatedListingDTO} from '../../../../../core/models/listing-general/PaginatedListingDTO';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentItem} from '../payment-item/payment-item';

@Component({
  selector: 'app-payment-latest',
  imports: [
    Loader,
    Paginator,
    TranslatePipe,
    PaymentItem
  ],
  templateUrl: './payment-latest.html',
  styleUrl: './payment-latest.css',
})
export class PaymentLatest implements OnInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _adminService = inject(AdminService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  readonly isMd = signal<boolean>(false);
  readonly payments = signal<PaginatedPaymentResponseDTO | null>(null);
  readonly loading = signal<boolean>(true);
  readonly totalPages = computed(() => this.payments()?.totalPages ?? 0);

  readonly filter = signal<GetAdminPanelPaymentsLatestDTO>({
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
        return this._adminService.loadLatestPayments(filter).pipe(
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
        this.payments.set(data);
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


  private applyFilter(filter: PaginatedListingDTO) {
    this.isBlocked.set(true);
    this.filterPageSubject.next(filter);
  }
}
