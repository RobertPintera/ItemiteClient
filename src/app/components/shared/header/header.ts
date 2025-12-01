import {Component, effect, inject, PLATFORM_ID, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ComboBox} from '../combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';
import {OptionItem} from '../../../core/models/OptionItem';
import {isPlatformBrowser} from '@angular/common';

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
  private _translate = inject(TranslateService);
  private _platformId = inject(PLATFORM_ID);

  readonly languages: OptionItem[] = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  readonly selectedLanguage = signal<OptionItem>(this.languages[0]);

  constructor() {
    if (!isPlatformBrowser(this._platformId)) return;

    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const languageItem = this.languages.find(l => l.value === savedLanguage);
      if (languageItem) {
        this.selectedLanguage.set(languageItem);
        this._translate.use(languageItem.value);
      }
    } else {
      this._translate.use(this.selectedLanguage().value);
    }

    effect(() => {
      const language = this.selectedLanguage();
      localStorage.setItem('selectedLanguage', language.value);
      this._translate.use(language.value);
    });
  }


  useLanguage(language?: OptionItem): void {
    if(!language) return;
    this.selectedLanguage.set(language);
  }

}
