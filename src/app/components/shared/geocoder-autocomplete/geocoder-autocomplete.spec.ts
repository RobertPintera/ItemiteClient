import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocoderAutocomplete } from './geocoder-autocomplete';

describe('GeocoderAutocomplete', () => {
  let component: GeocoderAutocomplete;
  let fixture: ComponentFixture<GeocoderAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeocoderAutocomplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeocoderAutocomplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
