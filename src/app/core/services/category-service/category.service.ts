import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {CategoryDTO} from '../../models/category/CategoryDTO';
import {CategoryTreeDTO} from '../../models/category/CategoryTreeDTO';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.itemiteApiUrl}/categories`;
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  private _mainCategories = signal<CategoryDTO[]>([]);
  readonly mainCategories = this._mainCategories.asReadonly();

  // API

  private getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${environment.itemiteApiUrl}/all`);
  }

  private getMainCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/main`);
  }

  private getSubcategories(parentId: number): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/sub/${parentId}`);
  }

  private getCategoryTree(rootCategoryId: number): Observable<CategoryTreeDTO> {
    return this.http.get<CategoryTreeDTO>(`${this.baseUrl}/tree/${rootCategoryId}`);
  }

  // Logic

  loadMainCategories(): Observable<CategoryDTO[]> {
    return this.getMainCategories().pipe(
      map(categories => {
        this._mainCategories.set(categories);
        return categories;
      }),
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadMainCategories:', err);
        throw err;
      })
    );
  }

  loadCategoryTree(rootCategoryId: number): Observable<CategoryTreeDTO> {
    return this.getCategoryTree(rootCategoryId).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadCategoryTree:', err);
        throw err;
      })
    );
  }

  loadSubcategories(rootCategoryId: number): Observable<CategoryDTO[]> {
    return this.getSubcategories(rootCategoryId).pipe(
      catchError(err => {
        this.errorHandlerService.SendErrorMessage(err);
        console.error('Error loadCategoryTree:', err);
        throw err;
      })
    );
  }
}
