import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {CategoryDTO} from '../../models/CategoryDTO';
import {CategoryTreeDTO} from '../../models/CategoryTreeDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/categories`;

  getAllCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${environment.apiUrl}/all`);
  }

  getMainCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/main`);
  }

  getSubCategories(parentId: number): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/sub/${parentId}`);
  }

  getCategoryTree(rootCategoryId: number): Observable<CategoryTreeDTO> {
    return this.http.get<CategoryTreeDTO>(`${this.baseUrl}/tree/${rootCategoryId}`);
  }
}
