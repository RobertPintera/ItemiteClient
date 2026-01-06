import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerDialog } from './banner-dialog';

describe('BannerDialog', () => {
  let component: BannerDialog;
  let fixture: ComponentFixture<BannerDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
