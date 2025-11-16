import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {ProductListingDTO} from '../../models/ProductListingDTO';
import {PutProductListingDTO} from '../../models/PutProductListingDTO';

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

  private postProductListing(productListing: ProductListingDTO) {
    return this.http.post(`${this.baseUrl}`, productListing);
  }

  private putProductListing(id: number,productListing: PutProductListingDTO) {
    return this.http.put(`${this.baseUrl}/${id}`, productListing);
  }

  // Updating Signals

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
