import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProducts } from './user-products';
import {TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../../core/services/user-service/user.service';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {ListingService} from '../../../core/services/listing-service/listing.service';

describe('UserProducts', () => {
  let component: UserProducts;
  let fixture: ComponentFixture<UserProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProducts, TranslateModule.forRoot()],
      providers: [UserService, PaymentService, ListingService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
