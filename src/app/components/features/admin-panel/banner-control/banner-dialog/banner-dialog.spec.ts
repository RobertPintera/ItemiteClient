import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerDialog } from './banner-dialog';
import {TranslateModule} from '@ngx-translate/core';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {ErrorHandlerService} from '../../../../../core/services/error-handler-service/error-handler-service';

describe('BannerDialog', () => {
  let component: BannerDialog;
  let fixture: ComponentFixture<BannerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerDialog, TranslateModule.forRoot()],
      providers: [AdminService, ErrorHandlerService]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
