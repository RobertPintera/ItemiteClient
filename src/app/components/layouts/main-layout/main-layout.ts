import { Component } from '@angular/core';
import {Header} from '../../shared/header/header';
import {Navbar} from '../../shared/navbar/navbar';
import {RouterOutlet} from '@angular/router';
import {ErrorNotification} from '../../shared/error-notification/error-notification';

@Component({
  selector: 'app-main-layout',
  imports: [
    Header,
    Navbar,
    RouterOutlet,
    ErrorNotification
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
