import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {PaymentCountsResponseDTO} from '../../../../core/models/payments/PaymentCountsResponseDTO';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {PAYMENT_STATUS, PAYMENT_TYPE, PaymentType} from '../../../../core/constants/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {isPaymentStatus, isPaymentType} from '../../../../core/type-guards/payment-type.guard';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Dialog} from '../../../shared/dialog/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {OptionItem} from '../../../../core/models/OptionItem';
import {Loader} from '../../../shared/loader/loader';
import {Paginator} from '../../../shared/paginator/paginator';
import {PaymentItem} from './payment-item/payment-item';
import {GetAdminPanelPaymentsLatestDTO} from '../../../../core/models/payments/GetAdminPanelPaymentsLatestDTO';
import {debounceTime, finalize, Subject, switchMap, takeUntil} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {PaginatedPaymentResponseDTO} from '../../../../core/models/payments/PaginatedPaymentResponseDTO';
import {PaymentFilter} from '../../../../core/models/payments/PaymentFilter';
import {GetAdminPanelPaymentsWithStatusDTO} from '../../../../core/models/payments/GetAdminPanelPaymentsWithStatusDTO';

@Component({
  selector: 'app-payment-control',
  imports: [
    Button,
    Dialog,
    TranslatePipe,
    ComboBox,
    Loader,
    Paginator,
    PaymentItem,
  ],
  templateUrl: './payment-control.html',
  styleUrl: './payment-control.css',
})
export class PaymentControl implements OnInit, OnDestroy {
  private _adminService = inject(AdminService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _breakpointObserver = inject(BreakpointObserver);
  private isFirstLoad = true;

  readonly isMd = signal<boolean>(false);
  readonly payments = signal<PaginatedPaymentResponseDTO | null>(null);
  readonly loading = signal<boolean>(false);
  readonly totalPages = computed(() => this.payments()?.totalPages ?? 0);

  readonly paymentsCounts = signal<PaymentCountsResponseDTO | null>(null);
  readonly isOpenCountsDialog = signal<boolean>(false);

  readonly filter = signal<PaymentFilter>({
    type: PAYMENT_TYPE.LATEST,
    pageSize: 1,
    pageNumber: 1,
    paymentStatus: null
  });
  readonly isBlocked = signal<boolean>(false);

  private filterPageSubject = new Subject<PaymentFilter>();
  private destroy$ = new Subject<void>();

  readonly statusOptions: OptionItem[] = Object.values(PAYMENT_STATUS).map(value => ({
    key: value,
    value: value,
  }));

  readonly selectedStatus = signal<OptionItem>(this.statusOptions[0]);

  ngOnInit() {
    this._breakpointObserver.observe([
      '(min-width: 768px)',
    ]).subscribe(result => {
      this.isMd.set(result.breakpoints['(min-width: 768px)']);
    });

    this._route.queryParamMap.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(params => {
      const updated: Partial<PaymentFilter> = {};

      const num = (name: string) => {
        const value = params.get(name);
        return value !== null ? Number(value) : null;
      };

      const type = params.get('type');

      if (type && isPaymentType(type)) {
        updated.type = type;
      } else {
        updated.type = PAYMENT_TYPE.LATEST;
      }

      const status = params.get('paymentStatus');

      if (status && isPaymentStatus(status)) {
        const option = this.statusOptions.find(o => o.key === status);

        if (option) {
          this.selectedStatus.set(option);
        }

        updated.paymentStatus = status;
      }

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;

      const newFilter = { ...this.filter(), ...updated };

      this.filter.set(newFilter);

      if(this.isFirstLoad){
        this.isFirstLoad = false;
        this.loading.set(true);
        this.isBlocked.set(true);


        const status = this.filter().paymentStatus ?? '';
        if(this.filter().type == PAYMENT_TYPE.WITH_STATUS && isPaymentStatus(status)){
          const payload: GetAdminPanelPaymentsWithStatusDTO = {
            ...newFilter,
            paymentStatus: status
          };

          this._adminService.loadPaymentsWithStatus(payload).pipe(
            finalize(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            })
          ).subscribe(data => {
            this.payments.set(data);
          });
        }else {
          const payload: GetAdminPanelPaymentsLatestDTO = {
            ...newFilter
          };

          this._adminService.loadLatestPayments(payload).pipe(
            finalize(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            })
          ).subscribe(data => {
            this.payments.set(data);
          });
        }
      }
      else {
        this.applyFilter(this.filter());
      }
    });

    this.filterPageSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        const status = this.filter().paymentStatus ?? '';
        if(this.filter().type == PAYMENT_TYPE.WITH_STATUS && isPaymentStatus(status)){
          const payload: GetAdminPanelPaymentsWithStatusDTO = {
            ...filter,
            paymentStatus: status
          };

          return this._adminService.loadPaymentsWithStatus(payload).pipe(
            finalize(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            })
          );
        }else {
          const payload: GetAdminPanelPaymentsLatestDTO = {
            ...filter
          };

          return this._adminService.loadLatestPayments(payload).pipe(
            finalize(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            })
          );
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.payments.set(data);
      },
    });


    this._adminService.loadPaymentsCounts().subscribe(counts => {
      this.paymentsCounts.set(counts);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  select(type: PaymentType) {
    this.updateFilter({type: type});
  }

  openCountsDialog(): void {
    this.isOpenCountsDialog.set(true);
  }

  closeCountsDialog(): void {
    this.isOpenCountsDialog.set(false);
  }

  selectStatus(status?: OptionItem){
    if(!status) return;

    if(isPaymentStatus(status.key)){
      this.updateFilter({paymentStatus: status.key });
    }
  }

  updateFilter(partial: Partial<PaymentFilter>){
    const newFilter = { ...this.filter(), ...partial };

    const hasOtherChanges = Object.keys(partial).some(key => key !== 'pageNumber');

    if (hasOtherChanges) {
      newFilter.pageNumber = 1;
    }

    const status = this.selectedStatus().key;
    newFilter.paymentStatus = isPaymentStatus(status) ? status : null;

    if(newFilter.type === PAYMENT_TYPE.LATEST){
      newFilter.paymentStatus = null;
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

  refreshFilter() {
    this.applyFilter(this.filter());
  }

  private applyFilter(filter: PaymentFilter) {
    this.isBlocked.set(true);
    this.filterPageSubject.next(filter);
  }

  private serializeFilterToQuery(filter: PaymentFilter): Record<string, string | number | (string | number)[]> {
    const params: Record<string, string | number | (string | number)[]> = {};

    if (filter.type) params['type'] = filter.type;
    if (filter.paymentStatus) params['paymentStatus'] = filter.paymentStatus;
    if (filter.pageNumber != null) params['pageNumber'] = filter.pageNumber;

    return params;
  }

  protected readonly PAYMENT_TYPE = PAYMENT_TYPE;
}
