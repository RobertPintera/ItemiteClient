import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CategoryService} from './core/services/category-service/category.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ItemiteClient');
  private categoryService = inject(CategoryService);

  ngOnInit() {
    this.categoryService.loadMainCategories().subscribe({
      // next: categories => console.log('Main categories loaded'),
      error: err => console.error(err)
    });
  }
}
