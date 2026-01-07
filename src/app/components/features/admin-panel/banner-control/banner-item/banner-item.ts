import {Component, inject, input, output, signal} from '@angular/core';
import {BannerDTO} from '../../../../../core/models/banners/BannerDTO';
import {Button} from '../../../../shared/button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {BUTTON_SEVERITY} from '../../../../../core/constants/constants';
import {ConfirmDialog} from '../../../../shared/confirm-dialog/confirm-dialog';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {finalize} from 'rxjs';
import {LoadingDialog} from '../../../../shared/loading-dialog/loading-dialog';
import {BannerDialog} from '../banner-dialog/banner-dialog';

@Component({
  selector: 'app-banner-item',
  imports: [
    Button,
    TranslatePipe,
    ConfirmDialog,
    LoadingDialog,
    BannerDialog
  ],
  templateUrl: './banner-item.html',
  styleUrl: './banner-item.css',
})
export class BannerItem {
  private _adminService = inject(AdminService);

  readonly banner = input.required<BannerDTO>();

  readonly successAction = output<void>();

  readonly loading = signal<boolean>(false);
  readonly isOpenEditDialog = signal<boolean>(false);
  readonly isOpenDeleteDialog = signal<boolean>(false);

  toggleActive(): void {
    this.loading.set(true);

    this._adminService.activeBanner(this.banner().id).pipe(finalize(() => this.loading.set(false))).subscribe(() => {
      this.successAction.emit();
    });
  }

  openEditDialog(): void {
    this.isOpenEditDialog.set(true);
  }

  openDeleteDialog(): void {
    this.isOpenDeleteDialog.set(true);
  }

  cancelDelete(){
    this.isOpenDeleteDialog.set(false);
  }

  confirmDelete(){
    this.isOpenDeleteDialog.set(false);
    this.loading.set(true);

    this._adminService.deleteBanner(this.banner().id).pipe(finalize(() => this.loading.set(false))).subscribe(() => {
      this.successAction.emit();
    });
  }

  confirmBanner(){
    this.successAction.emit();
  }

  protected readonly BUTTON_SEVERITY = BUTTON_SEVERITY;
}
