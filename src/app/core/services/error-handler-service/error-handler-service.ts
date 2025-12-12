import {Injectable, Signal, signal} from '@angular/core';
import {ErrorHandler} from '../../utility/ErrorHandler';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ErrorHandlerService {
  private _errorMessage = signal("");
  private _lastErrorMessage =  signal("");
  private _lastErrorCode = signal("");

  // This one is cleared after displayTime time
  readonly errorMessage : Signal<string> = this._errorMessage.asReadonly();

  // These persist
  readonly lastErrorMessage: Signal<string> = this._lastErrorMessage.asReadonly();
  readonly lastErrorCode : Signal<string> = this._lastErrorCode.asReadonly();

  async SendRawErrorMessage(error: string, displayTime: number = 5000) {
    this._errorMessage.set(error);
    await new Promise(resolve => setTimeout(resolve, displayTime));
    this._errorMessage.set("");
  }

  async SendErrorMessage(error: HttpErrorResponse, displayTime: number = 5000) {
    const message = ErrorHandler(error);
    this._errorMessage.set(message[0]);
    await new Promise(resolve => setTimeout(resolve, displayTime));
    this._errorMessage.set("");
  }
}
