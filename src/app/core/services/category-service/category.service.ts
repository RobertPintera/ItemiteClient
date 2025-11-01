import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {CategoryDTO} from '../../models/CategoryDTO';
import {CategoryTreeDTO} from '../../models/CategoryTreeDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/categories`;
  private _mainCategories = signal<CategoryDTO[]>([]);
  private _subCategories = signal<CategoryTreeDTO | null>(null);

  readonly mainCategories = this._mainCategories.asReadonly();
  readonly subCategories = this._subCategories.asReadonly();

  // API

  private getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${environment.apiUrl}/all`);
  }

  private getMainCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/main`);
  }

  private getSubCategories(parentId: number): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/sub/${parentId}`);
  }

  private getCategoryTree(rootCategoryId: number): Observable<CategoryTreeDTO> {
    return this.http.get<CategoryTreeDTO>(`${this.baseUrl}/tree/${rootCategoryId}`);
  }

  // Updating signals

  loadMainCategories(): Observable<CategoryDTO[]> {
    return this.getMainCategories().pipe(
      map(categories => {
        this._mainCategories.set(categories);
        return categories;
      }),
      catchError(err => {
        console.error('Error loadMainCategories:', err);
        throw err;
      })
    );
  }

  loadCategoryTree(rootCategoryId: number): Observable<CategoryTreeDTO> {
    return this.getCategoryTree(rootCategoryId).pipe(
      map(tree => {
        this._subCategories.set(tree);
        return tree;
      }),
      catchError(err => {
        console.error('Error loadCategoryTree:', err);
        throw err;
      })
    );
  }
}
