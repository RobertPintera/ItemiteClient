import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerControl } from './banner-control';

describe('BannerControl', () => {
  let component: BannerControl;
  let fixture: ComponentFixture<BannerControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerControl]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
