import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';

interface Category {
  id: number;
  name: string;
  image: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-categories',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  categories: Category[] = [
    {
      id: 1,
      name: 'Agriculture',
      image: 'assets/categories/agriculture_icon.svg',
      backgroundColor: 'bg-green-200'
    },
    {
      id: 2,
      name: 'Electronics',
      image: '/assets/categories/devices_icon.svg',
      backgroundColor: 'bg-blue-200'
    },
    {
      id: 3,
      name: 'Motorization',
      image: '/assets/categories/commute_icon.svg',
      backgroundColor: 'bg-indigo-200'
    },
    {
      id: 4,
      name: 'Fashion',
      image: '/assets/categories/apparel_icon.svg',
      backgroundColor: 'bg-pink-200'
    },
    {
      id: 5,
      name: 'Sports & Hobbies',
      image: '/assets/categories/sports_and_outdoors_icon.svg',
      backgroundColor: 'bg-red-200'
    },
    {
      id: 6,
      name: 'Kids & Baby',
      image: '/assets/categories/child_icon.svg',
      backgroundColor: 'bg-yellow-200'
    },
    {
      id: 7,
      name: 'Real Estate',
      image: '/assets/categories/apartment_icon.svg',
      backgroundColor: 'bg-purple-200'
    },
    {
      id: 8,
      name: 'Home & Garden',
      image: '/assets/categories/home_and_garden_icon.svg',
      backgroundColor: 'bg-teal-200'
    },
    {
      id: 9,
      name: 'Pets',
      image: '/assets/categories/pets_icon.svg',
      backgroundColor: 'bg-orange-200'
    },
    {
      id: 10,
      name: 'Services & Education',
      image: '/assets/categories/menu_book_icon.svg',
      backgroundColor: 'bg-cyan-200'
    },
    {
      id: 11,
      name: 'Industry',
      image: '/assets/categories/manufacturing_icon.svg',
      backgroundColor: 'bg-gray-200'
    },
    {
      id: 12,
      name: 'Health & Beauty',
      image: '/assets/categories/health_and_beauty_icon.svg',
      backgroundColor: 'bg-pink-300'
    },
    {
      id: 13,
      name: 'Events',
      image: '/assets/categories/newspaper_icon.svg',
      backgroundColor: 'bg-lime-200'
    },
    {
      id: 14,
      name: 'Jobs',
      image: '/assets/categories/work_icon.svg',
      backgroundColor: 'bg-blue-300'
    },
  ]
}
