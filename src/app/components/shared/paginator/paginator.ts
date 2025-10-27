import {Component, computed, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-paginator',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  readonly totalItems = input<number>(1);
  readonly itemsPerPage = 5;
  readonly currentPage = signal<number>(1);

  readonly pageChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage));

  currentPageValue = 1;

  goToPage(value: number) {
    let page = isNaN(value) ? 1 : value;

    if (page < 1) page = 1;
    else if (page > this.totalPages()) page = this.totalPages();

    if (page === this.currentPage()){
      this.pageChange.emit(page);

    }

    this.currentPage.set(page);
    this.currentPageValue = page;
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
    if (allowedKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
