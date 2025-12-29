import { Component } from '@angular/core';
import {Loader} from '../loader/loader';

@Component({
  selector: 'app-loading-dialog',
  imports: [
    Loader
  ],
  templateUrl: './loading-dialog.html',
  styleUrl: './loading-dialog.css',
})
export class LoadingDialog {

}
