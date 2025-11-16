import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {PutProductListingDTO} from '../../models/PutProductListingDTO';
import {AuctionListingDTO} from '../../models/AuctionListingDTO';

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

  private postAuctionListingDTO(productListing: AuctionListingDTO) {
    return this.http.post(`${this.baseUrl}`, productListing);
  }

  private putAuctionListing(id: number,productListing: PutProductListingDTO) {
    return this.http.put(`${this.baseUrl}/${id}`, productListing);
  }

  // Updating Signals

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
