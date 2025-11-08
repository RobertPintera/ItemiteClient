import {Component, inject} from '@angular/core';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';
import {ErrorNotification} from '../../shared/error-notification/error-notification';

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

  languages = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  useLanguage(language: { key: string; value: string }): void {
    if(!language) return;
    this._translate.use(language?.value);
  }

}
