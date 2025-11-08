import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../.env';
import {AutocompletePayloadDTO} from '../../models/AutocompletePayloadDTO';
import {catchError, debounceTime, map, Observable, Subject, switchMap, takeUntil, throwError} from 'rxjs';
import {Localization} from '../../models/Localization';
import {GeoapifyResponseDTO} from '../../models/GeoapifyResponseDTO';
import {LatLenPayloadDTO} from '../../models/LatLenPayloadDTO';
import {response} from 'express';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class GeoapifyService {
  private _geoapifyUrl = environment.geoapifyUrl;
  private _cancelSubject: Subject<void> = new Subject(); // Subject to cancel previous requests

  constructor(
    private http: HttpClient
  ) {}

  ReverseGeocode(request: LatLenPayloadDTO): Observable<Localization> {
    const params = new HttpParams()
      .set('apiKey', environment.geoapifyApiKey)
      .set('lat', request.lat)
      .set('lon', request.lng)
      .set('limit', 1);
    if(request.filter) {
      params.set('filter', request.filter);
    }
    return this.http.get(`${this._geoapifyUrl}/reverse`, {params}).pipe(
      map((response: any) => {
        const suggestion: Localization[] = response.features.map((feature: any) => ({
          country: feature.properties.country,
          city: feature.properties.city,
          state: feature.properties.state,
          formatted: `${feature.properties.city}, ${feature.properties.state}, ${feature.properties.country}`,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
        }));

        return suggestion[0];
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  private Autocomplete(request: AutocompletePayloadDTO): Observable<GeoapifyResponseDTO> {
    const params = new HttpParams()
      .set('apiKey', environment.geoapifyApiKey)
      .set('text', request.text)
      .set('type', request.type);
    if(request.filter) {
      params.set('filter', request.filter);
    }

    return this.http.get(`${this._geoapifyUrl}/autocomplete`, {params}).pipe(
      map((response: any) => {
        // Extract and map the relevant fields from the response
        const suggestions: Localization[] = response.features.map((feature: any) => ({
          country: feature.properties.country,
          city: feature.properties.city,
          state: feature.properties.state,
          formatted: `${feature.properties.city}, ${feature.properties.state}, ${feature.properties.country}`,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
        }));

        return { suggestions }; // Returning the mapped data as GeoapifyResponseDTO
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Debounced autocomplete method with cancellation of previous calls
  DebounceAutocomplete(query: string, type: string, filter:string|undefined = undefined, debounceDelay: number = 500): Observable<GeoapifyResponseDTO> {
    const requestPayload: AutocompletePayloadDTO = {
      text: query,
      type: type,
      filter: filter,
    };

    // Return a debounced observable that cancels previous requests
    return new Observable<GeoapifyResponseDTO>((observer) => {
      // Cancel any previous request
      this._cancelSubject.next();

      this.Autocomplete(requestPayload).pipe(
        debounceTime(debounceDelay), // Delay the call
        switchMap(() => this.Autocomplete(requestPayload)), // Switch to the new observable
        takeUntil(this._cancelSubject) // Cancel the current observable when a new one is fired
      ).subscribe({
        next: (response) => observer.next(response),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }
}
