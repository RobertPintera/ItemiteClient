import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from '../../../shared/button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {BannerDialog} from './banner-dialog/banner-dialog';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {BannerDTO} from '../../../../core/models/banners/BannerDTO';
import {finalize} from 'rxjs';
import {Loader} from '../../../shared/loader/loader';
import {BannerItem} from './banner-item/banner-item';

@Component({
  selector: 'app-banner-control',
  imports: [
    Button,
    TranslatePipe,
    BannerDialog,
    Loader,
    BannerItem
  ],
  templateUrl: './banner-control.html',
  styleUrl: './banner-control.css',
})
export class BannerControl implements OnInit {
  private _adminService = inject(AdminService);

  readonly isOpenBannerDialog = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly banners = signal<BannerDTO[]>([]);

  ngOnInit() {
    this.loadBanners();
  }

  openBannerDialog() {
    this.isOpenBannerDialog.set(true);
  }

  refreshCategories(): void {
    this.loadBanners();
  }

  private loadBanners() {
    this.loading.set(true);
    this._adminService.loadAllBanners().pipe(finalize(() => this.loading.set(false))).subscribe(banners => {
      this.banners.set(banners);
    });
  }
}
