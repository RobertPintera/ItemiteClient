import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable} from 'rxjs';
import {BannerDTO} from '../../models/banners/BannerDTO';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/banner`;

  private getActiveBanners(): Observable<BannerDTO[]> {
    return this.http.get<BannerDTO[]>(`${this.baseUrl}/active`);
  }

  loadActivebanners(){
    return this.getActiveBanners().pipe(
      catchError(err => {
        console.error('Error loadActivebanners:', err);
        throw err;
      })
    );
  }
}
