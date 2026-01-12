import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryControl } from './category-control';
import {TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

const categoryServiceStub = {
  loadMainCategories: () => of([
    { id: 1, name: 'Category', polishName: 'Kategoria', svgImage: null, description: 'Desc' }
  ]),
  loadSubcategories: (id: number) => of([])
};


const adminServiceStub = {
  deleteCategory: (id: number, payload: unknown) => of(null),
};

const domSanitizerStub = {
  bypassSecurityTrustHtml: (html: string) => html
};

const activatedRouteStub = {
  queryParams: of({})
};

describe('CategoryControl', () => {
  let component: CategoryControl;
  let fixture: ComponentFixture<CategoryControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryControl, TranslateModule.forRoot()],
      providers: [
        { provide: CategoryService, useValue: categoryServiceStub },
        { provide: AdminService, useValue: adminServiceStub },
        { provide: DomSanitizer, useValue: domSanitizerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
