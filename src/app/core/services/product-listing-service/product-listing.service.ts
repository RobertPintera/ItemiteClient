import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ProductListingDTO} from '../../models/ProductListingDTO';
import {PutProductListingDTO} from '../../models/PutProductListingDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/productlisting`;

  // API

  private getProductListing(id: number): Observable<ProductListingDTO> {
    return this.http.get<ProductListingDTO>(`${this.baseUrl}/productlisting/${id}`);
  }

  private postProductListing(productListing: ProductListingDTO) {
    return this.http.post(`${this.baseUrl}/productlisting`, productListing);
  }

  private putProductListing(id: number,productListing: PutProductListingDTO) {
    return this.http.put(`${this.baseUrl}/productlisting/${id}`, productListing);
  }

}
