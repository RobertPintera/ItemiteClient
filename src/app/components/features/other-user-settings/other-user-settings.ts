import {Component, input, output} from '@angular/core';
import {Button} from '../../shared/button/button';
import {Dialog} from '../../shared/dialog/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from '../../shared/input-number/input-number';
import {LoadingDialog} from '../../shared/loading-dialog/loading-dialog';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-other-user-settings',
  imports: [
    Button,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './other-user-settings.html',
  styleUrl: './other-user-settings.css',
})
export class OtherUserSettings {
  onEditPriceClicked = output<void>();
  onDeletePriceClicked = output<void>();
  onCloseClicked = output<void>();

  isOpen = input.required<boolean>();

  EditPrice() {
    this.onEditPriceClicked.emit();
  }

  DeletePrice() {
    this.onDeletePriceClicked.emit();
  }

  CloseDialog() {
    this.onCloseClicked.emit();
  }
}
