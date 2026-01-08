import {Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {OptionItem} from '../../../core/models/OptionItem';
import {ReportService} from '../../../core/services/report-service/report.service';
import {errorTranslations} from '../../../core/constants/ErrorTranslations';
import {UpdateEmailErrors} from '../../../core/utility/Validation';
import {ResourceType} from '../../../core/constants/constants';
import {FileUpload} from '../../shared/file-upload/file-upload';
import {sign} from 'node:crypto';
import {LoadingCircle} from '../../shared/loading-circle/loading-circle';

@Component({
  selector: 'app-report-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ComboBox,
    FileUpload,
    LoadingCircle
  ],
  templateUrl: './report-form.html',
  styleUrl: './report-form.css',
})
export class ReportForm implements OnInit {
  readonly MAX_CHARS = 500;
  readonly MAX_ATTACHMENTS = 6;

  private _translateService = inject(TranslateService);
  private _reportService = inject(ReportService);

  private _attachments = signal<File[]>([]);
  private _canAddAttachment = signal<boolean>(true);
  readonly canAddAttachment = this._canAddAttachment.asReadonly();
  readonly attachments = this._attachments.asReadonly();
  private _showAttachmentInput = signal(false);
  readonly showAttachmentInput = this._showAttachmentInput.asReadonly();
  private _text = signal("");
  private _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();
  private _success = signal<boolean>(false);
  readonly success = this._success.asReadonly();

  private _resourceType: ResourceType = "Auction";

  reportForm: FormGroup;

  private _comboboxOptionItems:WritableSignal<OptionItem[]> = signal([
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

  // validation
  private _currentChars = signal(0);
  readonly currentChars = this._currentChars.asReadonly();
  readonly charLimitExceeded = computed(() => this.currentChars() > this.MAX_CHARS);
  readonly isValid = computed(()=>
    !this.charLimitExceeded() &&
    this._text() !== "" &&
    this._attachments().length < 7
  );

  constructor() {
    this.reportForm = new FormGroup({
      message: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500)
      ])
    });
  }

  ngOnInit(): void {
    this.reportForm.get("message")?.valueChanges.subscribe((value) => {
      this.UpdateCharCount();
    });

    this._translateService.onLangChange.subscribe((value) => {
      this.UpdateTranslations();
    });

    this.UpdateTranslations();
  }

  async OnSubmit() {
    this._success.set(false);
    if(this.reportForm.invalid || !this.isValid()) return;
    this._loading.set(true);
    const success = await this._reportService.Report(
      this._text(),
      this._resourceType,
      this._attachments()
    );
    this._loading.set(false);
    if (success) {
      this.reportForm.get("message")?.setValue("");
      this.ClearAttachments();
      this._success.set(true);
    }
  }

  ChangeResourceType(option: OptionItem | undefined) {
    if(!option) return;

    switch (option.key) {
      case 'Auction':
        this._resourceType = option.key;
        break;
      case 'Product':
        this._resourceType = option.key;
        break;
      case 'ChatPage':
        this._resourceType = option.key;
        break;
      case 'User':
        this._resourceType = option.key;
        break;
    }
  }

  private UpdateCharCount() {
    const field = this.reportForm.get("message");
    const cleared = field?.value.trim() ?? "";

    const length = cleared.length + (cleared.match(/\n/g)?.length ?? 0) * 3;

    this._text.set(cleared);
    this._currentChars.set(length);
  }

  // region Attachments
  AddAttachment(file: File) {
    this._attachments.update((attachments) => {
      attachments.push(file); return attachments;
    });
    this._showAttachmentInput.set(false);
    this._canAddAttachment.set(this._attachments().length < 6);
  }

  DeleteAttachment(index: number) {
    this._attachments.update(attachments => {
        attachments.splice(index, 1);
        return attachments;
      }
    );
    this._canAddAttachment.set(this._attachments().length < 6);
  }

  ClearAttachments() {
    this._attachments.set([]);
  }

  SwitchAttachmentsVisibility() {
    this._showAttachmentInput.set(!this._showAttachmentInput());
  }
  // endregion

  UpdateTranslations() {
    this._comboboxOptionItems.update(items=> {
      const updated = [...items];

      for(const item of updated) {
        const sub = this._translateService.get(`notifications.${item.key}`).subscribe((translatedText: string) => {
          item.value = translatedText;
        });
        sub.unsubscribe();
      }

      return updated;
    });
  }

}
