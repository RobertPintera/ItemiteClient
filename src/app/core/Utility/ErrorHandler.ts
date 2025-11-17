import { HttpErrorResponse } from "@angular/common/http";

// Returns array of [error description, error]
export function ErrorHandler(error: HttpErrorResponse): Array<string> {
  console.log(error);
  if (error.error && error.error.message) {
    // Error thrown by client
    return [error.error.message, error.status.toString()];
  } else if(error.error) {
    // Error thrown by API
    let message:string = error.error.Message;
    if(error.error.Errors) {
      for(let i = 0; i < error.error.Errors.length; i++) {
        if(i === 0) {
          message = error.error.Errors[i];
          continue;
        }
        message += `\n\r${error.error.Errors[i]}`;
      }
    }
    return [message, error.status.toString()];
  } else {
    return [error.statusText, error.status.toString()];
  }
}
