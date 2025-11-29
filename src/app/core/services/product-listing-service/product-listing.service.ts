import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {ProductListingDTO} from '../../models/ProductListingDTO';
import {PutProductListingDTO} from '../../models/PutProductListingDTO';
import {PostProductListingDTO} from '../../models/PostProductListingDTO';
import {PostProductListingResponseDTO} from '../../models/PostProductListingResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/productlisting`;

  // API
  private getProductListing(id: number): Observable<ProductListingDTO> {
    return this.http.get<ProductListingDTO>(`${this.baseUrl}/${id}`);
  }

  private postProductListing(formData: FormData): Observable<PostProductListingResponseDTO> {
    return this.http.post<PostProductListingResponseDTO>(`${this.baseUrl}`, formData, { withCredentials: true });
  }

  private putProductListing(id: number,productListing: PutProductListingDTO) {
    return this.http.put(`${this.baseUrl}/${id}`, productListing);
  }

  // Logic
  createProductListing(productListing: PostProductListingDTO) {
    const formData = new FormData();
    formData.append('Name', productListing.name);
    formData.append('Description', productListing.description);
    formData.append('Price', parseFloat(productListing.price.toFixed(2)).toString());
    formData.append('IsNegotiable', productListing.isNegotiable.toString());
    formData.append('CategoryId', productListing.categoryId.toString());
    formData.append('Location.Longitude', productListing.locationLongitude.toString());
    formData.append('Location.Latitude', productListing.locationLatitude.toString());
    formData.append('Location.Country', productListing.locationCountry);
    formData.append('Location.City', productListing.locationCity);
    formData.append('Location.State', productListing.locationState);

    productListing.images.forEach((file, idx) => {
      formData.append('Images', file);
      formData.append('ImageOrders', productListing.imageOrders[idx].toString());
    });

    return this.postProductListing(formData).pipe(
      map(createdProductListing => {
        return createdProductListing;
      }),
      catchError(err => {
        console.error('Error createProductListingFormData:', err);
        throw err;
      })
    );
  }

  loadProductListing(id: number){
    return this.getProductListing(id).pipe(
      map(product => {
        return product;
      }),
      catchError(err => {
        console.error('Error loadProductListing:', err);
        throw err;
      })
    );
  }
}
