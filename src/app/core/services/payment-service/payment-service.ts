import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {PostStripeConnectStartDTO} from '../../models/payments/PostStripeConnectStartDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/payment`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  // API
  private postStripeConnectStart(): Observable<PostStripeConnectStartDTO>{
    return this.http.post<PostStripeConnectStartDTO>(`${this.baseUrl}/stripe/connect/start`, {});
  }

  private getStripeConnectRefreshOnboardingLink() {
    return this.http.get(`${this.baseUrl}/stripe/connect/refresh-onboarding-link`);
  }

  private postPurchaseProduct(productListingId: number, params: HttpParams){
    return this.http.post(`${this.baseUrl}/purchase-product/${productListingId}`, { params });
  }

  private getMyPurchases(params: HttpParams) {
    return this.http.get(`${this.baseUrl}/my-purchases`, { params });
  }

  private getMySales(params: HttpParams) {
    return this.http.get(`${this.baseUrl}/my-sales`, { params });
  }

  private postPaymentConfirmDelivery(listingId: number ,params: HttpParams) {
    return this.http.put(`${this.baseUrl}/confirm-delivery/${listingId}`, { params });
  }

  private postPaymentDispute(paymentId: number,params: HttpParams) {
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
}
