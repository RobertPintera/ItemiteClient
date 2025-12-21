import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {PostStripeConnectStartResponseDTO} from '../../models/payments/PostStripeConnectStartResponseDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PaginatedListingDTO} from '../../models/PaginatedListingDTO';
import {PostPurchaseProductDTO} from '../../models/payments/PostPurchaseProductDTO';
import {PostDisputeDTO} from '../../models/payments/PostDisputeDTO';
import {GetPurchasesDTO} from '../../models/payments/GetPurchasesDTO';
import {GetPurchasesResponseDTO} from '../../models/payments/GetPurchasesResponseDTO';
import {GetOnboardingStatusResponseDTO} from '../../models/payments/GetOnboardingStatusResponseDTO';
import {isPlatformBrowser} from '@angular/common';
import {AuthService} from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/payment`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  private readonly _onboardingStatus = signal<boolean>(false);

  readonly onboardingStatus = this._onboardingStatus.asReadonly();

  constructor() {
    if(!isPlatformBrowser(this.platformId)) return;

    effect(() => {
      const isLogged = this.authService.isUserLoggedIn();
      if(!isLogged) {
        this._onboardingStatus.set(true);
      }
    });

    this.loadOnboardingStatus().subscribe(onboardingStatus => this._onboardingStatus.set(onboardingStatus.isOnboarded));
  }

  // API
  private postStripeConnectStart(): Observable<PostStripeConnectStartResponseDTO>{
    return this.http.post<PostStripeConnectStartResponseDTO>(`${this.baseUrl}/stripe/connect/start`, {});
  }

  private getStripeConnectRefreshOnboardingLink() {
    return this.http.get(`${this.baseUrl}/stripe/connect/refresh-onboarding-link`);
  }

  private getOnboardingStatus(): Observable<GetOnboardingStatusResponseDTO>{
    return this.http.get<GetOnboardingStatusResponseDTO>(`${this.baseUrl}/stripe/onboarding-status`);
  }

  private postPurchaseProduct(productListingId: number, params: HttpParams){
    return this.http.post(`${this.baseUrl}/purchase-product/${productListingId}`, { params });
  }

  private getMyPurchases(params: HttpParams): Observable<GetPurchasesResponseDTO> {
    return this.http.get<GetPurchasesResponseDTO>(`${this.baseUrl}/my-purchases`, { params });
  }

  private getMySales(params: HttpParams) {
    return this.http.get(`${this.baseUrl}/my-sales`, { params });
  }

  private postConfirmDelivery(listingId: number) {
    return this.http.put(`${this.baseUrl}/confirm-delivery/${listingId}`, {});
  }

  private postDispute(paymentId: number,params: HttpParams) {
    return this.http.put(`${this.baseUrl}/dispute/${paymentId}`, params);
  }

  // Logic
  connectStripeStart() {
    return this.postStripeConnectStart().pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error createProductListing:', err);
        throw err;
      })
    );
  }

  loadOnboardingStatus(): Observable<GetOnboardingStatusResponseDTO> {
    return this.getOnboardingStatus().pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadOnboardingStatus:', err);
        throw err;
      })
    );
  }

  purchaseProduct(productListingId: number, data: PostPurchaseProductDTO) {
    const params = new HttpParams()
      .set('paymentMethodId', data.paymentMethodId);

    return this.postPurchaseProduct(productListingId, params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error purchaseProduct:', err);
        throw err;
      })
    );
  }

  loadPurchases(filter: GetPurchasesDTO){
    const params = new HttpParams()
      .set('pageSize', filter.pageSize)
      .set('pageNumber', filter.pageNumber);

    return this.getMyPurchases(params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadPurchases:', err);
        throw err;
      })
    );
  }

  loadSales(filter: PaginatedListingDTO){
    const params = new HttpParams()
      .set('pageSize', filter.pageSize)
      .set('pageNumber', filter.pageNumber);

    return this.getMySales(params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadSales:', err);
        throw err;
      })
    );
  }

  confirmDelivery(listingId: number) {
    return this.postConfirmDelivery(listingId).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadSales:', err);
        throw err;
      })
    );
  }

  dispute(listingId: number, data: PostDisputeDTO) {
    let params = new HttpParams()
      .set('Reason', data.reason)
      .set('Description', data.description);

    data.photos.forEach(id => {
      params = params.append('photos', id.toString());
    });

    return this.postDispute(listingId, params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadSales:', err);
        throw err;
      })
    );
  }
}
