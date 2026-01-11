import { TestBed } from '@angular/core/testing';

import { ListingService } from './listing.service';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ErrorHandlerService} from '../error-handler-service/error-handler-service';
import {LISTING_TYPES} from '../../constants/constants';
import {environment} from '../../../../environments/environment';

describe('ListingService', () => {
  let service: ListingService;
  let httpMock: HttpTestingController;
  let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListingService,
        provideHttpClientTesting(),
        {
          provide: ErrorHandlerService,
          useValue: jasmine.createSpyObj('ErrorHandlerService', [
            'SendErrorMessage'
          ])
        }
      ]
    });

    service = TestBed.inject(ListingService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandler = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /listing with correct params', () => {
    service.loadListing({
      pageSize: 10,
      pageNumber: 1,
      listingType: LISTING_TYPES.PRODUCT,
      categoryIds: [1, 2]
    }).subscribe();

    const req = httpMock.expectOne(req => req.url === `${environment.itemiteApiUrl}/listing`);

    expect(req.request.method).toBe('GET');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('pageNumber')).toBe('1');
    expect(req.request.params.get('listingType')).toBe(LISTING_TYPES.PRODUCT);
    expect(req.request.params.getAll('categoryIds')).toEqual(['1', '2']);

    req.flush({});
  });
});
