import {Component, inject} from '@angular/core';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';
import {ErrorNotification} from '../../shared/error-notification/error-notification';
import {OptionItem} from '../../../core/models/OptionItem';

@Component({
  selector: 'app-external-configs-layout',
  imports: [
    ComboBox,
    ErrorNotification
  ],
  templateUrl: './external-configs-layout.html',
  styleUrl: './external-configs-layout.css'
})
export class ExternalConfigsLayout {
  private _translate = inject(TranslateService);

  languages: OptionItem[] = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  useLanguage(language?: OptionItem): void {
    if(!language) return;

    this._translate.use(language?.value);
  }
}
