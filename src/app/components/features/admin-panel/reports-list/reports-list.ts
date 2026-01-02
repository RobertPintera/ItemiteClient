import {Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {ReportService} from '../../../../core/services/report-service/report.service';
import {isPlatformServer} from '@angular/common';
import {OptionItem} from '../../../../core/models/OptionItem';
import {TranslateService} from '@ngx-translate/core';
import {ResourceType} from '../../../../core/constants/constants';
import {User} from '../../../../core/models/user/User';
import {Report} from '../../../../core/models/reports/Report';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {ReportCard} from './report-card/report-card';
import {ImagePreview} from '../../../shared/image-preview/image-preview';

@Component({
  selector: 'app-reports-list',
  imports: [
    LoadingCircle,
    ComboBox,
    ReportCard,
    ImagePreview
  ],
  templateUrl: './reports-list.html',
  styleUrl: './reports-list.css',
})
export class ReportsList implements OnInit {
  readonly REPORTS_PER_PAGE = 10;

  private _reportService = inject(ReportService);
  private _platformId = inject(PLATFORM_ID);
  private _translateService = inject(TranslateService);
  private _errorService = inject(ErrorHandlerService);

  private _reports = signal<Report[]>([]);
  readonly reports = this._reports.asReadonly();

  private _totalPages = signal<number>(0);
  readonly totalPages = this._totalPages.asReadonly();
  private _currentPage = signal<number>(0);
  readonly currentPage = this._currentPage.asReadonly();
  private _currentFilter: ResourceType | undefined;

  private _comboboxOptionItems: WritableSignal<OptionItem[]> = signal([
    {
      key: '---',
      value: ''
    },
    {
      key: 'Auction',
      value: 'Auction'
    },
    {
      key: 'Product',
      value: 'Product'
    },
    {
      key: 'ChatPage',
      value: 'ChatPage'
    },
    {
      key: 'User',
      value: 'User'
    }
  ]);
  readonly comboboxOptionItems = this._comboboxOptionItems.asReadonly();
  private _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();
  private _previewImage = signal(false);
  readonly previewImage = this._previewImage.asReadonly();
  private _imagePreview = signal("");
  readonly imagePreview = this._imagePreview.asReadonly();

  async ngOnInit() {
    if(isPlatformServer(this._platformId)) return;

    this._translateService.onLangChange.subscribe((value) => {
      this.UpdateTranslations();
    });

    this.UpdateTranslations();
    await this.GetReports(1, undefined);
  }

  async ChangeResourceType(option: OptionItem | undefined) {
    let resourceType: ResourceType | undefined = undefined;
    if(!option) return;

    switch (option.key) {
      case 'Auction':
        resourceType = option.key;
        break;
      case 'Product':
        resourceType = option.key;
        break;
      case 'ChatPage':
        resourceType = option.key;
        break;
      case 'User':
        resourceType = option.key;
        break;
    }
    this._currentFilter = resourceType;
    await this.GetReports(1, resourceType);
  }

  private async GetReports(pageNum: number, resourceType: ResourceType | undefined) {
    if(this._loading()) return;

    this._loading.set(true);

    this._reportService.GetReports(
      pageNum,
      resourceType,
      this.REPORTS_PER_PAGE
    ).subscribe({
      next: (value) => {
        this._reports.set(value.items);
        this._totalPages.set(value.totalPages);
        this._currentPage.set(value.currentPage);
      },
      error: (error) => {
        this._errorService.SendErrorMessage(error);
      }
    });

    this._loading.set(false);
  }

  OpenImagePreview(imageUrl: string) {
    this._imagePreview.set(imageUrl);
    this._previewImage.set(true);
  }

  CloseImagePreview() {
    this._previewImage.set(false);
  }

  UpdateTranslations() {
    this._comboboxOptionItems.update(items=> {
      const updated = [...items];

      for(const item of updated) {
        if(item.key === '---') continue;

        const sub = this._translateService.get(`notifications.${item.key}`).subscribe((translatedText: string) => {
          item.value = translatedText;
        });
        sub.unsubscribe();
      }

      return updated;
    });
  }

  async PreviousPage() {
    await this.GetReports(this._currentPage() - 1, this._currentFilter);
  }
  async NextPage() {
    await this.GetReports(this._currentPage() + 1, this._currentFilter);
  }
}
