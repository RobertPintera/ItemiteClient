import { HttpErrorResponse } from "@angular/common/http";
import {TranslateApiError} from './ApiErrorTranslator';
import {TranslateService} from '@ngx-translate/core';

// Returns array of [error description, error]
export async function ErrorHandler(error: HttpErrorResponse, translate: TranslateService): Promise<string[]> {
  console.log(error);
  if (error.error && error.error.message) {
    // Error thrown by client
    return [error.error.message, error.status.toString()];
  } else if(error.error) {
    // Error thrown by API
    let message:string = await TranslateApiError(error.error.Message, translate);
    if(error.error.Errors) {
      for(let i = 0; i < error.error.Errors.length; i++) {
        if(i === 0) {
          message = await TranslateApiError(error.error.Errors[i], translate);
          continue;
        }
        message += `\n\r${await TranslateApiError(error.error.Errors[i], translate)}`;
      }
    }
    return [message, error.status.toString()];
  } else {
    return [error.statusText, error?.status?.toString() ?? "Unknown error"];
  }
}
