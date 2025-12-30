import {Component, computed, inject, input, Signal, signal} from '@angular/core';
import {parseISO} from 'date-fns';
import {UserBasicInfo} from '../../../../../core/models/user/UserBasicInfo';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {User} from '../../../../../core/models/user/User';
import {LoadingCircle} from '../../../../shared/loading-circle/loading-circle';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-control-card',
  imports: [
    ReactiveFormsModule,
    LoadingCircle,
    TranslatePipe
  ],
  templateUrl: './user-control-card.html',
  styleUrl: './user-control-card.css',
})
export class UserControlCard {
  // todo success/fail message

  readonly user = input.required<User>();

  private _adminService = inject(AdminService);

  private _selectedDate = signal("");
  private _isDateValid = signal(false);
  readonly isDateValid = this._isDateValid.asReadonly();
  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();
  private _operationResult = signal<"" | "user_locked" | "user_unlocked" | "failed" | "notif_sent">("");
  readonly operationResult = this._operationResult.asReadonly();
  private _currentTab = signal<"lock" | "unlock" | "notify">("notify");
  readonly currentTab = this._currentTab.asReadonly();
  private _showOptions = signal(false);
  readonly showOptions = this._showOptions.asReadonly();

  readonly name = computed(() =>
    this.user().userName
  );
  readonly email = computed(() =>
    this.user().email
  );
  readonly profilePicture = computed(() =>
    this.user().photoUrl == null ? "../../../../../../assets/images/default_profile_pic.png" : this.user().photoUrl!
  );

  constructor() {
    this.lockUserForm = new FormGroup({
      reason: new FormControl('',[]),
      expirationDate: new FormControl('',[]),
    });

    this.notifyUserForm = new FormGroup({
      message: new FormControl('',[]),
      title: new FormControl('',[]),
      subject: new FormControl('',[])
    });

    this.unlockUserForm = new FormGroup({
      reasonUnlock: new FormControl('',[])
    });
  }

  // region notification
  notifyUserForm: FormGroup;

  async SendNotification() {
    const message:string = (this.notifyUserForm.get('message')?.value ?? "").trim();
    if(this._loading() || message === "") return;
    this._loading.set(true);
    const success = await this._adminService.SendNotification(
      this.user().id,
      this.notifyUserForm.value.subject === "" ? "Itemite notification" : this.notifyUserForm.value.subject,
      this.notifyUserForm.value.title === "" ? "Itemite notification" : this.notifyUserForm.value.title,
      message
    );
    this._loading.set(false);

  }
  // endregion

  // region User unlock
  unlockUserForm: FormGroup;
  async UnlockUser() {
    const message = this.unlockUserForm.value.reasonUnlock ?? "";

    this._loading.set(true);
    const success = await this._adminService.UnlockUser(this.user().id, message);
    this._loading.set(false);
    this._operationResult.set(
      success ? "user_unlocked" : "failed"
    );
  }
  // endregion

  // region User lock
  lockUserForm: FormGroup;

  OnDateChanged(event: Event) {
    const element = event.target as HTMLInputElement;
    if(!this.ValidateDate(element.value)) return;
    this._selectedDate.set(this.ToIsoUtc(element.value));
  }

  ValidateDate(dateString: string): boolean {
    const date = parseISO(`${dateString}T00:00:01`);
    const now = new Date();
    this._isDateValid.set(date >= now);
    return date >= now;
  }

  ToIsoUtc(dateFromInput: string): string {
    const date = parseISO(dateFromInput);
    const now = new Date();

    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )).toISOString();
  }

  async LockUser() {
    if(!this.isDateValid()) return;

    const message = this.lockUserForm.value.reason ?? "";

    this._loading.set(true);
    const success = await this._adminService.LockUser(this.user().id, this._selectedDate(), message);
    this._loading.set(false);
    this._operationResult.set(
      success ? "user_locked" : "failed"
    );
  }
  // endregion

  // region UI
  ChangeTab(tab: "lock" | "unlock" | "notify") {
    this._currentTab.set(tab);
  }
  SwitchShowOptions(): void {
    this._showOptions.set(!this.showOptions());
  }
  // endregion


}
