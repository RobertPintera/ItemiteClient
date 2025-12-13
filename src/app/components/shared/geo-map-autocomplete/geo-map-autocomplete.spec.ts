import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMapAutocomplete } from './geo-map-autocomplete';

describe('GeoMapAutocomplete', () => {
  let component: GeoMapAutocomplete;
  let fixture: ComponentFixture<GeoMapAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoMapAutocomplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoMapAutocomplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
