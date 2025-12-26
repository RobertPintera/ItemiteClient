import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {PostStripeConnectStartResponseDTO} from '../../models/payments/PostStripeConnectStartResponseDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PaginatedListingDTO} from '../../models/PaginatedListingDTO';
import {PostDisputeDTO} from '../../models/payments/PostDisputeDTO';
import {GetPurchasesDTO} from '../../models/payments/GetPurchasesDTO';
import {GetPurchasesResponseDTO} from '../../models/payments/GetPurchasesResponseDTO';
import {GetOnboardingStatusResponseDTO} from '../../models/payments/GetOnboardingStatusResponseDTO';
import {isPlatformBrowser} from '@angular/common';
import {AuthService} from '../auth-service/auth.service';
import {PostPurchaseProductDTO} from '../../models/payments/PostPurchaseProductDTO';
import {GetSalesResponseDTO} from '../../models/payments/GetSalesResponseDTO';

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

  private getOnboardingStatus(): Observable<GetOnboardingStatusResponseDTO>{
    return this.http.get<GetOnboardingStatusResponseDTO>(`${this.baseUrl}/stripe/onboarding-status`);
  }

  private postPurchaseProduct(productListingId: number, body: PostPurchaseProductDTO){
    return this.http.post(`${this.baseUrl}/purchase-product/${productListingId}`, body);
  }

  private getMyPurchases(params: HttpParams): Observable<GetPurchasesResponseDTO> {
    return this.http.get<GetPurchasesResponseDTO>(`${this.baseUrl}/my-purchases`, { params });
  }

  private getMySales(params: HttpParams): Observable<GetSalesResponseDTO> {
    return this.http.get<GetSalesResponseDTO>(`${this.baseUrl}/my-sales`, { params });
  }

  private postConfirmDelivery(listingId: number) {
    return this.http.post(`${this.baseUrl}/confirm-delivery/${listingId}`, {});
  }

  private postDispute(paymentId: number, formData: FormData) {
    return this.http.post(`${this.baseUrl}/dispute/${paymentId}`, formData);
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

  purchaseProduct(productListingId: number, methodPaymentId: string) {
    const body: PostPurchaseProductDTO = {
      paymentMethodId: methodPaymentId
    };

    return this.postPurchaseProduct(productListingId, body).pipe(
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
        console.error('Error confirmDelivery:', err);
        throw err;
      })
    );
  }

  dispute(paymentId: number, data: PostDisputeDTO) {
    const formData = new FormData();

    formData.append('Reason', data.reason);
    formData.append('Description', data.description);

    data.photos.forEach((file) => {
      formData.append('photos', file);
    });

    console.log(paymentId);
    console.log(formData);

    return this.postDispute(paymentId, formData).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error dispute:', err);
        throw err;
      })
    );
  }
}
