import {Component, inject, OnInit} from '@angular/core';
import {Header} from '../../shared/header/header';
import {Navbar} from '../../shared/navbar/navbar';
import {RouterOutlet} from '@angular/router';
import {ErrorNotification} from '../../shared/error-notification/error-notification';
import {Footer} from '../../shared/footer/footer';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {NotificationService} from '../../../core/services/notification-service/notification.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    Header,
    Navbar,
    RouterOutlet,
    ErrorNotification,
    Footer
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.categoryService.loadMainCategories().subscribe({
      // next: categories => console.log('Main categories loaded'),
      error: err => console.error(err)
    });
  }
}
