import {Component, computed, inject, PLATFORM_ID, signal} from '@angular/core';
import { parseISO } from 'date-fns';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserBasicInfo} from '../../../../core/models/user/UserBasicInfo';
import {ErrorHandlerService} from '../../../../core/services/error-handler-service/error-handler-service';
import {LoadingCircle} from '../../../shared/loading-circle/loading-circle';
import {UserControlCard} from './user-control-card/user-control-card';
import {User} from '../../../../core/models/user/User';
import {GlobalNotificationInput} from './global-notification-input/global-notification-input';

@Component({
  selector: 'app-user-control',
  imports: [
    ReactiveFormsModule,
    LoadingCircle,
    UserControlCard,
    GlobalNotificationInput
  ],
  templateUrl: './user-control.html',
  styleUrl: './user-control.css',
})
export class UserControl {
  private _adminService = inject(AdminService);
  private _errorHandler = inject(ErrorHandlerService);

  readonly USERS_PER_PAGE = 10;

  private _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  private _totalPagesOfUsers = signal<number>(0);
  readonly totalPagesOfUsers = this._totalPagesOfUsers.asReadonly();
  private _currentPageOfUsers = signal<number>(0);
  readonly currentPageOfUsers = this._currentPageOfUsers.asReadonly();

  private _loadingUsers = signal(false);
  readonly loadingUsers = this._loadingUsers.asReadonly();
  readonly canPreviousUsers = computed(() =>
    this._currentPageOfUsers() > 1
  );
  readonly canNextUsers = computed(() =>
    this._currentPageOfUsers() < this._totalPagesOfUsers()
  );

  userSearchForm: FormGroup;

  constructor() {
    this.userSearchForm = new FormGroup({
      query: new FormControl('',[])
    });
  }

  //region Form
  OnSubmitUserSearch() {
    this.LoadUsersPage(1);
  }

  PreviousUserPage() {
    this.LoadUsersPage(this._currentPageOfUsers() - 1);
  }
  NextUsersPage(): void {
    this.LoadUsersPage(this._currentPageOfUsers() + 1);
  }

  LoadUsersPage(pageNum: number): void {
    if(this.loadingUsers()) return;

    this._loadingUsers.set(true);
    this._adminService.GetUsers(
      pageNum,
      this.userSearchForm.value.query,
      this.USERS_PER_PAGE
    ).subscribe({
      next: (users) => {
        this._users.set(users.items);
        this._totalPagesOfUsers.set(users.totalPages);
        this._currentPageOfUsers.set(users.currentPage);
        this._loadingUsers.set(false);
      },
      error: (err) => {
        this._errorHandler.SendErrorMessage(err);
        this._loadingUsers.set(false);
      }
    });
  }
  // endregion
}
