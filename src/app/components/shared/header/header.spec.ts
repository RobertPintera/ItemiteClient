import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

const activatedRouteStub = {
  snapshot: {
    paramMap: {
      get: (key: string) => null
    },
    queryParamMap: {
      get: (key: string) => null
    }
  },
  params: of({}),
  queryParams: of({})
};


describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, TranslateModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
