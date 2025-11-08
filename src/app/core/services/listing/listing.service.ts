import {inject, Injectable, } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {ListingDTO} from '../../models/ListingDTO';
import {ListingFilter} from '../../models/ListingFilter';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/api/listing`;

  // API

  private getListing(): Observable<ListingDTO> {
    return this.http.get<ListingDTO>(`${this.baseUrl}`);
  }

  private deleteListing(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Updating signals

  loadListing(filter?: ListingFilter): Observable<ListingDTO> {
    let params = new HttpParams();

    if (filter?.pageSize != null) params = params.set('pageSize', filter.pageSize);
    if (filter?.pageNumber != null) params = params.set('pageNumber', filter.pageNumber);
    if (filter?.listingType) params = params.set('listingType', filter.listingType);
    if (filter?.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter?.sortDirection) params = params.set('sortDirection', filter.sortDirection);
    if (filter?.priceFrom != null) params = params.set('priceFrom', filter.priceFrom);
    if (filter?.priceTo != null) params = params.set('priceTo', filter.priceTo);
    if (filter?.longitude != null) params = params.set('longitude', filter.longitude);
    if (filter?.latitude != null) params = params.set('latitude', filter.latitude);
    if (filter?.distance != null) params = params.set('distance', filter.distance);
    if (filter?.categoryIds?.length) params = params.set('categoryIds', filter.categoryIds.join(','));

    return this.http.get<ListingDTO>(`${this.baseUrl}`, { params }).pipe(
      catchError(err => {
        console.error('Error getFilteredListings:', err);
        throw err;
      })
    );
  }
}
