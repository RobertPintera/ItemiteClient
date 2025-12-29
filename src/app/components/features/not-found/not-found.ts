import {Component, HostBinding, inject} from '@angular/core';
import {Button} from '../../shared/button/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    Button
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  @HostBinding('class') hostClass = 'block';

  private _router = inject(Router);

  goHome() {
    this._router.navigate(['/']);
  }
}
