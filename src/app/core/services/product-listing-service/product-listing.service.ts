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
    formData.append('name', productListing.name);
    formData.append('description', productListing.description);
    formData.append('price', productListing.price.toString());
    formData.append('isNegotiable', productListing.isNegotiable.toString());
    formData.append('categoryId', productListing.categoryId.toString());
    formData.append('locationLongitude', productListing.locationLongitude.toString());
    formData.append('locationLattitude', productListing.locationLattitude.toString());
    formData.append('locationCountry', productListing.locationCountry);
    formData.append('locationCity', productListing.locationCity);
    formData.append('locationState', productListing.locationState);

    productListing.images.forEach((file, idx) => {
      formData.append('images', file);  // plik
      formData.append('imageOrders', productListing.imageOrders[idx].toString());
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
