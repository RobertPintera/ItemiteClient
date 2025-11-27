import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ComboBox} from '../combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';
import {OptionItem} from '../../../core/models/OptionItem';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    ComboBox
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private translate = inject(TranslateService);

  readonly languages: OptionItem[] = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  useLanguage(language?: OptionItem): void {
    if(!language) return;
    this.translate.use(language?.value);
  }
}
