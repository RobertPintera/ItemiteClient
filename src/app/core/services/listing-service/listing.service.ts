import {inject, Injectable, } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {ListingResponseDTO} from '../../models/ListingResponseDTO';
import {ListingFilter} from '../../models/ListingFilter';
import {PaginatedUserListingDTO} from '../../models/PaginatedUserListingDTO';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/listing`;

  // API

  private getListing(params: HttpParams): Observable<ListingResponseDTO> {
    return this.http.get<ListingResponseDTO>(`${this.baseUrl}`, { params });
  }

  private getListingUser(id: number, params: HttpParams): Observable<ListingResponseDTO>{
    return this.http.get<ListingResponseDTO>(`${this.baseUrl}`, { params } );
  }

  private deleteListing(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Logic

  loadListing(filter?: ListingFilter): Observable<ListingResponseDTO> {
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
    if (filter?.categoryIds?.length) {
      filter.categoryIds.forEach(id => {
        params = params.append('categoryIds', id.toString());
      });
    }

    return this.getListing(params).pipe(
      catchError(err => {
        console.error('Error getFilteredListings:', err);
        throw err;
      })
    );
  }

  loadUserListings(id: number, filter: PaginatedUserListingDTO) {
    const params = new HttpParams()
      .set('pageSize', filter.pageSize)
      .set('pageNumber', filter.pageNumber);

    return this.getListingUser(id, params).pipe(
      catchError(err => {
        console.error('Error getFilteredListings:', err);
        throw err;
      })
    );
  }
}
