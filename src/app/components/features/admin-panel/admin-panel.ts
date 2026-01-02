import { Component } from '@angular/core';
import {Button} from '../../shared/button/button';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-panel',
  imports: [
    Button,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

}
