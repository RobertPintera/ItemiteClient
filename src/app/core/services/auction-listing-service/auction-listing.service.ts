import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {AuctionListingDTO} from '../../models/AuctionListingDTO';
import {PostAuctionListingDTO} from '../../models/PostAuctionListingDTO';
import {PutAuctionListingDTO} from '../../models/PutAuctionListingDTO';
import {PostAuctionListingResponseDTO} from '../../models/PostAuctionListingResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuctionListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/auctionlisting`;

  // API
  private getAuctionListing(id: number): Observable<AuctionListingDTO> {
    return this.http.get<AuctionListingDTO>(`${this.baseUrl}/${id}`);
  }

  private postAuctionListingDTO(formData: FormData): Observable<PostAuctionListingResponseDTO> {
    return this.http.post<PostAuctionListingResponseDTO>(`${this.baseUrl}`, formData);
  }

  private putAuctionListing(id: number, formData: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
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
        console.error('Error updateAuctionListing:', err);
        throw err;
      })
    );
  }


  loadAuctionListing(id: number){
    return this.getAuctionListing(id).pipe(
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
