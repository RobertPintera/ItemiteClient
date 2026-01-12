import { TestBed } from '@angular/core/testing';

import { ProductListingService } from './product-listing.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {PostProductListingDTO} from '../../models/product-listings/PostProductListingDTO';
import {environment} from '../../../../environments/environment';

describe('ProductListingService', () => {
  let service: ProductListingService;
  let httpMock: HttpTestingController;
  let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductListingService,
        provideHttpClientTesting(),
        {
          provide: ErrorHandlerService,
          useValue: jasmine.createSpyObj('ErrorHandlerService', ['SendErrorMessage'])
        }
      ]
    });

    service = TestBed.inject(ProductListingService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandler = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /productlisting when creating a product', () => {
    const product: PostProductListingDTO = {
      name: 'Test Product',
      description: 'Desc',
      price: 10.5,
      isNegotiable: true,
      categoryId: 1,
      locationLongitude: 10,
      locationLatitude: 20,
      locationCountry: 'PL',
      locationCity: 'Warsaw',
      locationState: 'Mazovia',
      images: [new File([], 'test.jpg')],
      imageOrders: [1]
    };

    service.createProductListing(product).subscribe();

    const req = httpMock.expectOne(`${environment.itemiteApiUrl}/productlisting`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    req.flush({});
  });
});
