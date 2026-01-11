import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { CategoryService} from '../../../core/services/category-service/category.service';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, TranslateModule.forRoot()],
      providers: [CategoryService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
