import {Component, computed, effect, signal, Signal} from '@angular/core';
import {ErrorHandlerService} from '../../../core/services/error-handler-service/error-handler-service';

@Component({
  selector: 'app-error-notification',
  imports: [],
  templateUrl: './error-notification.html',
  styleUrl: './error-notification.css'
})
export class ErrorNotification {
  private _errorMessage = signal("");
  readonly errorMessage:Signal<string> = this._errorMessage.asReadonly();
  readonly hasError = computed(() => this.errorMessage() !== "");

  constructor(errorHandlerService: ErrorHandlerService) {
    effect(() => {
      this._errorMessage.set(errorHandlerService.errorMessage())
    });
  }
}
