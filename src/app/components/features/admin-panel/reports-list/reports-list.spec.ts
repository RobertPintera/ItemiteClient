import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsList } from './reports-list';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';

const errorHandlerStub = {
  SendErrorMessage: (msg: string) => null
};

describe('ReportsList', () => {
  let component: ReportsList;
  let fixture: ComponentFixture<ReportsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsList, TranslateModule.forRoot()],
      providers: [{ provide: ErrorHandlerService, useValue: errorHandlerStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
