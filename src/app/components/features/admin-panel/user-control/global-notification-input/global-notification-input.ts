import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LoadingCircle} from '../../../../shared/loading-circle/loading-circle';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-global-notification-input',
  imports: [
    ReactiveFormsModule,
    LoadingCircle,
    TranslatePipe
  ],
  templateUrl: './global-notification-input.html',
  styleUrl: './global-notification-input.css',
})
export class GlobalNotificationInput {

  private _adminService = inject(AdminService);

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();
  private _operationResult = signal<null | boolean>(null);
  readonly operationResult = this._operationResult.asReadonly();

  notifyForm: FormGroup;

  constructor() {
    this.notifyForm = new FormGroup({
      message: new FormControl('',[]),
      title: new FormControl('',[]),
      subject: new FormControl('',[])
    });
  }

  async SendNotification() {
    const message:string = (this.notifyForm.value.message ?? "").trim();

    if(this._loading() || message === "") return;
    this._loading.set(true);
    const success = await this._adminService.SendGlobalNotification(
      this.notifyForm.value.subject === "" ? "Itemite notification" : this.notifyForm.value.subject,
      this.notifyForm.value.title === "" ? "Itemite notification" : this.notifyForm.value.title,
      message
    );
    this._loading.set(false);
  }
}
