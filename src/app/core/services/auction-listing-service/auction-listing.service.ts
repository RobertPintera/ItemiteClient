import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {AuctionListingDTO} from '../../models/AuctionListingDTO';
import {PostAuctionListingDTO} from '../../models/PostAuctionListingDTO';
import {PutAuctionListingDTO} from '../../models/PutAuctionListingDTO';
import {PostAuctionListingResponseDTO} from '../../models/PostAuctionListingResponseDTO';
import {Bid} from '../../models/auction-listing/Bid';
import {PostBidAuctionListingResponseDTO} from '../../models/auction-listing/PostBidAuctionListingResponseDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PostBidAuctionListingDTO} from '../../models/auction-listing/PostBidAuctionListingDTO';

@Injectable({
  providedIn: 'root'
})
export class AuctionListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/auctionlisting`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  // API
  private getAuctionListingPublic(id: number): Observable<AuctionListingDTO> {
    return this.http.get<AuctionListingDTO>(`${this.baseUrl}/${id}`,
      {
        transferCache: true,
        withCredentials: false
      }
    );
  }

  private getAuctionListingAuth(id: number): Observable<AuctionListingDTO> {
    return this.http.get<AuctionListingDTO>(`${this.baseUrl}/${id}`, {
      transferCache: false,
    });
  }

  private postAuctionListingDTO(formData: FormData): Observable<PostAuctionListingResponseDTO> {
    return this.http.post<PostAuctionListingResponseDTO>(`${this.baseUrl}`, formData);
  }

  private putAuctionListing(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  private postBidAuctionListing(id: number, body: PostBidAuctionListingDTO): Observable<PostBidAuctionListingResponseDTO> {
    return this.http.post<PostBidAuctionListingResponseDTO>(`${this.baseUrl}/${id}/bid`, body);
  }

  private getBidHistoryAuctionListing(id: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/${id}/bid`);
  }

  // Logic
  createAuctionListing(auction: PostAuctionListingDTO){
    const formData = new FormData();
    formData.append('Name', auction.name);
    formData.append('Description', auction.description);
    formData.append('StartingBid', parseFloat(auction.startingBid.toFixed(2)).toString());
    formData.append('CategoryId', auction.categoryId.toString());
    formData.append('Location.Longitude', auction.locationLongitude.toString());
    formData.append('Location.Latitude', auction.locationLatitude.toString());
    formData.append('Location.Country', auction.locationCountry);
    formData.append('Location.City', auction.locationCity);
    formData.append('Location.State', auction.locationState);
    formData.append('DateEnds',auction.dateEnds);

    auction.images.forEach((file, idx) => {
      formData.append('Images', file);
      formData.append('ImageOrders', auction.imageOrders[idx].toString());
    });

    return this.postAuctionListingDTO(formData).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error createAuctionListing:',err);
        throw err;
      })
    );
  }

  updateAuctionListing(id: number, auction: PutAuctionListingDTO) {
    const formData = new FormData();
    formData.append('Name', auction.name);
    formData.append('Description', auction.description);
    formData.append('Location.Longitude', auction.locationLongitude.toString());
    formData.append('Location.Latitude', auction.locationLatitude.toString());
    formData.append('CategoryId', auction.categoryId.toString());
    formData.append('Location.Country', auction.locationCountry);
    formData.append('Location.City', auction.locationCity);
    formData.append('Location.State', auction.locationState);
    formData.append('StartingBid', parseFloat(auction.startingBid.toFixed(2)).toString());
    formData.append('DateEnds', auction.dateEnds);

    auction.existingPhotoIds.forEach((photo, idx) => {
      formData.append('ExistingPhotoIds', photo.toString());
      formData.append('ExistingPhotoOrders', auction.existingPhotoOrders[idx].toString());
    });

    auction.newImages.forEach((image, idx) => {
      formData.append('newImages', image);
      formData.append('newImageOrders', auction.newImageOrders[idx].toString() );
    });

    return this.putAuctionListing(id, formData).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error updateAuctionListing:', err);
        throw err;
      })
    );
  }

  loadAuctionListingPublic(id: number){
    return this.getAuctionListingPublic(id).pipe(
      map(auction => {
        return auction;
      }),
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadProductListingPublic:', err);
        throw err;
      })
    );
  }

  loadAuctionListingAuth(id: number){
    return this.getAuctionListingAuth(id).pipe(
      map(auction => {
        return auction;
      }),
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadProductListingAuth:', err);
        throw err;
      })
    );
  }

  bidAuctionListing(id: number, data: PostBidAuctionListingDTO){
    return this.postBidAuctionListing(id, data).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error getBidHistoryAuctionListing:', err);
        throw err;
      })
    );
  }

  showBidHistoryAuctionListing(id: number){
    return this.getBidHistoryAuctionListing(id).pipe(
      map(bids => {
        return bids;
      }),
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error getBidHistoryAuctionListing:', err);
        throw err;
      })
    );
  }
}
