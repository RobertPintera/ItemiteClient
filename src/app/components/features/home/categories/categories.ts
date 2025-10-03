import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {TranslateDirective, TranslatePipe} from '@ngx-translate/core';

interface Category {
  id: number;
  key: string;
  image: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-categories',
  imports: [
    NgOptimizedImage,
    NgClass,
    TranslatePipe,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  categories: Category[] = [
    {
      id: 1,
      key: 'agriculture',
      image: 'assets/categories/agriculture_icon.svg',
      backgroundColor: 'bg-green-200'
    },
    {
      id: 2,
      key: 'electronics',
      image: '/assets/categories/devices_icon.svg',
      backgroundColor: 'bg-blue-200'
    },
    {
      id: 3,
      key: 'motorization',
      image: '/assets/categories/commute_icon.svg',
      backgroundColor: 'bg-indigo-200'
    },
    {
      id: 4,
      key: 'fashion',
      image: '/assets/categories/apparel_icon.svg',
      backgroundColor: 'bg-pink-200'
    },
    {
      id: 5,
      key: 'sports_hobbies',
      image: '/assets/categories/sports_and_outdoors_icon.svg',
      backgroundColor: 'bg-red-200'
    },
    {
      id: 6,
      key: 'kids_baby',
      image: '/assets/categories/child_icon.svg',
      backgroundColor: 'bg-yellow-200'
    },
    {
      id: 7,
      key: 'real_estate',
      image: '/assets/categories/apartment_icon.svg',
      backgroundColor: 'bg-purple-200'
    },
    {
      id: 8,
      key: 'home_garden',
      image: '/assets/categories/home_and_garden_icon.svg',
      backgroundColor: 'bg-teal-200'
    },
    {
      id: 9,
      key: 'pets',
      image: '/assets/categories/pets_icon.svg',
      backgroundColor: 'bg-orange-200'
    },
    {
      id: 10,
      key: 'services_education',
      image: '/assets/categories/menu_book_icon.svg',
      backgroundColor: 'bg-cyan-200'
    },
    {
      id: 11,
      key: 'industry',
      image: '/assets/categories/manufacturing_icon.svg',
      backgroundColor: 'bg-gray-200'
    },
    {
      id: 12,
      key: 'health_beauty',
      image: '/assets/categories/health_and_beauty_icon.svg',
      backgroundColor: 'bg-pink-300'
    },
    {
      id: 13,
      key: 'events',
      image: '/assets/categories/newspaper_icon.svg',
      backgroundColor: 'bg-lime-200'
    },
    {
      id: 14,
      key: 'jobs',
      image: '/assets/categories/work_icon.svg',
      backgroundColor: 'bg-blue-300'
    },
  ]
}
