import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ComboBox} from '../combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';

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
  protected readonly title = signal('ngx-translate-demo-standalone');

  private translate = inject(TranslateService);

  languages = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  useLanguage(language: { key: string; value: string }): void {
    if(!language) return;
    this.translate.use(language?.value);
  }
}
