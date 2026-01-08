import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {ProductListingDTO} from '../../models/product-listings/ProductListingDTO';
import {PutProductListingDTO} from '../../models/product-listings/PutProductListingDTO';
import {PostProductListingDTO} from '../../models/product-listings/PostProductListingDTO';
import {PostProductListingResponseDTO} from '../../models/product-listings/PostProductListingResponseDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PostUserPriceDTO} from '../../models/product-listings/PostUserPriceDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/productlisting`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  // API
  private getProductListingPublic(id: number){
    return this.http.get<ProductListingDTO>(`${this.baseUrl}/${id}`,
      {
        transferCache: true,
        withCredentials: false
      }
    );
  }

  private getProductListingAuth(id: number): Observable<ProductListingDTO> {
    return this.http.get<ProductListingDTO>(`${this.baseUrl}/${id}`, {
      transferCache: false,
    });
  }

  private postProductListing(formData: FormData): Observable<PostProductListingResponseDTO> {
    return this.http.post<PostProductListingResponseDTO>(`${this.baseUrl}`, formData);
  }

  private putProductListing(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  private postUserPrice(listingId: number, userId: number, data: PostUserPriceDTO) {
    return this.http.post(`${this.baseUrl}/${listingId}/user-price/${userId}`, data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }

  private deleteUserPrice(listingId: number, userId: number) {
    return this.http.delete(`${this.baseUrl}/${listingId}/user-price/${userId}`);
  }

  // Logic
  createProductListing(product: PostProductListingDTO) {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description);
    formData.append('Price', parseFloat(product.price.toFixed(2)).toString());
    formData.append('IsNegotiable', product.isNegotiable.toString());
    formData.append('CategoryId', product.categoryId.toString());
    formData.append('Location.Longitude', product.locationLongitude.toString());
    formData.append('Location.Latitude', product.locationLatitude.toString());
    formData.append('Location.Country', product.locationCountry);
    formData.append('Location.City', product.locationCity);
    formData.append('Location.State', product.locationState);

    product.images.forEach((file, idx) => {
      formData.append('Images', file);
      formData.append('ImageOrders', product.imageOrders[idx].toString());
    });

    return this.postProductListing(formData).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error createProductListing:', err);
        throw err;
      })
    );
  }

  updateProductListing(id: number, product: PutProductListingDTO) {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description);
    formData.append('Location.Longitude', product.locationLongitude.toString());
    formData.append('Location.Latitude', product.locationLatitude.toString());
    formData.append('Location.Country', product.locationCountry);
    formData.append('Location.City', product.locationCity);
    formData.append('Location.State', product.locationState);
    formData.append('Price', parseFloat(product.price.toFixed(2)).toString());
    formData.append('IsNegotiable', product.isNegotiable.toString());
    formData.append('CategoryId', product.categoryId.toString());

    product.existingPhotoIds.forEach((photo, idx) => {
      formData.append('ExistingPhotoIds', photo.toString());
      formData.append('ExistingPhotoOrders', product.existingPhotoOrders[idx].toString());
    });

    product.newImages.forEach((image, idx) => {
      formData.append('newImages', image);
      formData.append('newImageOrders', product.newImageOrders[idx].toString() );
    });

    return this.putProductListing(id, formData).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error updateProductListing:', err);
        throw err;
      })
    );
  }

  loadProductListingPublic(id: number){
    return this.getProductListingPublic(id).pipe(
      map(product => {
        return product;
      }),
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadProductListingPublic:', err);
        throw err;
      })
    );
  }

  loadProductListingAuth(id: number){
    return this.getProductListingAuth(id).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadProductListingAuth:', err);
        throw err;
      })
    );
  }

  loadProductListingPublicNoError(id: number){
    return this.getProductListingPublic(id);
  }

  addUserIndividualPrice(listingId: number, userId: number, data: PostUserPriceDTO) {

    return this.postUserPrice(listingId, userId, data).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error addUserIndividualPrice:', err);
        throw err;
      })
    );
  }

  deleteUserIndividualPrice(listingId: number, userId: number){
    return this.deleteUserPrice(listingId, userId).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error addUserIndividualPrice:', err);
        throw err;
      })
    );
  }
}
