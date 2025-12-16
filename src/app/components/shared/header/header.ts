import {Component, computed, effect, inject, PLATFORM_ID, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ComboBox} from '../combo-box/combo-box';
import {TranslateService} from '@ngx-translate/core';
import {OptionItem} from '../../../core/models/OptionItem';
import {isPlatformBrowser} from '@angular/common';
import {OnProfileMenu} from '../../features/on-profile-menu/on-profile-menu';
import {UserService} from '../../../core/services/user-service/user.service';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import {NotificationService} from '../../../core/services/notification-service/notification.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    ComboBox,
    OnProfileMenu
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private _translate = inject(TranslateService);
  private _platformId = inject(PLATFORM_ID);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);

  readonly languages: OptionItem[] = [
    { key: 'en', value: 'en' },
    { key: 'pl', value: 'pl' },
  ];

  readonly selectedLanguage = signal<OptionItem>(this.languages[0]);
  private _showProfileMenu = signal(false);
  readonly showProfileMenu = this._showProfileMenu.asReadonly();
  private _playHideAnim = signal(false);
  readonly playHideAnim = this._playHideAnim.asReadonly();
  readonly notificationCountClamped = computed(() =>
    Math.min(this._notificationService.notificationCount(), 99)
  );
  readonly increaseFontSize = computed(() =>
    this._notificationService.notificationCount() < 10
  );

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

  async SwitchShowProfileMenu(state: boolean | null = null) {
    // dont overlap animations
    if(state !== null) {
      this._showProfileMenu.set(state);
      return;
    }

    if(this.playHideAnim()) return;

    if(this._showProfileMenu()) {
      this._playHideAnim.set(true);
      // Wait for 0.2s for the animation to complete
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    this._playHideAnim.set(false);
    this._showProfileMenu.set(!this._showProfileMenu());
  }

  async OnProfileIconClicked() {
    if(this._authService.isUserLoggedIn()) {
      await this.SwitchShowProfileMenu();
      return;
    }
    await this._router.navigate(['login']);
  }
}
