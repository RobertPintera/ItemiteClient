import {Component, computed, effect, signal, Signal} from '@angular/core';
import {ErrorHandlerService} from '../../../core/services/error-handler-service/error-handler-service';

@Component({
  selector: 'app-error-notification',
  imports: [],
  templateUrl: './error-notification.html',
  styleUrl: './error-notification.css'
})
export class ErrorNotification {
  _errorMessage = signal("");
  errorMessage:Signal<string> = this._errorMessage;
  hasError = computed(() => this.errorMessage() !== "");

  constructor(errorHandlerService: ErrorHandlerService) {
    effect(() => {
      this._errorMessage.set(errorHandlerService.errorMessage())
    });
  }
}
