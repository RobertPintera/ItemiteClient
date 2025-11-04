import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ProductListingDTO} from '../../models/ProductListingDTO';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/listing`;

  // API

  private getListing(): Observable<ProductListingDTO> {
    return this.http.get<ProductListingDTO>(`${this.baseUrl}}`);
  }

  private deleteListing(id: number): Observable<ProductListingDTO> {
    return this.http.delete<ProductListingDTO>(`${this.baseUrl}/${id}`);
  }
}
