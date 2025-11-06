import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {ListingDTO} from '../../models/ListingDTO';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/listing`;

  private _listing = signal<ListingDTO | null>(null);

  readonly listing = this._listing.asReadonly();

  // API

  private getListing(): Observable<ListingDTO> {
    return this.http.get<ListingDTO>(`${this.baseUrl}`);
  }

  private deleteListing(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Updating signals

  loadListing(){
    return this.getListing().pipe(
      map(list => {
        this._listing.set(list);
        return list;
      }),
      catchError(err => {
        console.error('Error loadListing:', err);
        throw err;
      })
    );
  }
}
