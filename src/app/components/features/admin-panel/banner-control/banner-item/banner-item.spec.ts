import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerItem } from './banner-item';

describe('BannerItem', () => {
  let component: BannerItem;
  let fixture: ComponentFixture<BannerItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerItem]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
