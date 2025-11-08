import {Injectable, Signal, signal} from '@angular/core';
import {ErrorHandler} from '../../Utility/ErrorHandler';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ErrorHandlerService {
  private _errorMessage = signal("");
  readonly errorMessage : Signal<string> = this._errorMessage.asReadonly();

  async SendErrorMessage(error: HttpErrorResponse, displayTime: number = 3000) {
    const message = ErrorHandler(error);
    this._errorMessage.set(message);
    await new Promise(resolve => setTimeout(resolve, displayTime));
    this._errorMessage.set("");
  }
}
