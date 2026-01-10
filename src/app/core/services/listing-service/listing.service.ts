import {inject, Injectable, } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {ListingResponseDTO} from '../../models/listing-general/ListingResponseDTO';
import {PaginatedListingDTO} from '../../models/listing-general/PaginatedListingDTO';
import {ListingType} from '../../constants/constants';
import {ListingItemDTO} from '../../models/listing-general/LitstingItemDTO';
import {PostListingFollowDTO} from '../../models/listing-general/PostListingFollowDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {GetUserListingDTO} from '../../models/listing-general/GetUserListingDTO';
import {GetListingDTO} from '../../models/listing-general/GetListingDTO';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/listing`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  // API

  private getListing(params: HttpParams): Observable<ListingResponseDTO> {
    return this.http.get<ListingResponseDTO>(`${this.baseUrl}`, { params });
  }

  private getListingUser(id: number, params: HttpParams): Observable<ListingResponseDTO>{
    return this.http.get<ListingResponseDTO>(`${this.baseUrl}/${id}`, { params } );
  }

  private putArchiveListing(id: number) {
    return this.http.put(`${this.baseUrl}/archive/${id}`, {});
  }

  private getDedicatedListing(listingType: ListingType): Observable<ListingItemDTO[]>{
    return this.http.get<ListingItemDTO[]>(`${this.baseUrl}/dedicated`, {
      params: { listingType }
    });
  }

  private getListingFollow(params: HttpParams): Observable<ListingResponseDTO> {
    return this.http.get<ListingResponseDTO>(`${this.baseUrl}/follow`, { params });
  }

  private postListingFollow(id: number): Observable<PostListingFollowDTO>{
    return this.http.post<PostListingFollowDTO>(`${this.baseUrl}/follow/${id}`, null);
  }

  private deleteListingFollow(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/follow/${id}`);
  }

  // Logic

  loadListing(filter?: Partial<GetListingDTO>): Observable<ListingResponseDTO> {
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

  loadUserListings(id: number, filter: GetUserListingDTO) {
    let params = new HttpParams()
      .set('pageSize', filter.pageSize)
      .set('pageNumber', filter.pageNumber);

    if (filter.areArchived !== null) {
      params = params.set('areArchived', filter.areArchived);
    }

    return this.getListingUser(id, params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error getFilteredListings:', err);
        throw err;
      })
    );
  }

  archiveListing(id: number) {
    return this.putArchiveListing(id).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error archiveListing:', err);
        throw err;
      })
    );
  }

  loadDedicatedListing(type: ListingType): Observable<ListingItemDTO[]> {
    return this.getDedicatedListing(type).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadDedicatedListing:',err);
        throw err;
      })
    );
  }

  loadFollowedListing(filter: PaginatedListingDTO){
    const params = new HttpParams()
      .set('pageSize', filter.pageSize)
      .set('pageNumber', filter.pageNumber);

    return this.getListingFollow(params).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error getFilteredListings:', err);
        throw err;
      })
    );
  }

  addFollowedListing(id: number): Observable<PostListingFollowDTO>{
    return this.postListingFollow(id).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error addFollowedListing:',err);
        throw err;
      })
    );
  }

  deleteFollowedListing(id: number): Observable<void> {
    return this.deleteListingFollow(id).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error deleteFollowedListing:',err);
        throw err;
      })
    );
  }
}
