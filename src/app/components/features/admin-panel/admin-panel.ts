import { Component } from '@angular/core';
import {Button} from '../../shared/button/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [
    Button,
    RouterLink
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {

}
