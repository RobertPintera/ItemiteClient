import { HttpErrorResponse } from "@angular/common/http";

// Returns array of [error description, error]
export function ErrorHandler(error: HttpErrorResponse): Array<string> {
  if (error.error.message) {
    // Error thrown by client
    console.log(error);
    return [error.error.message];
  } else {
    // Error thrown by API
    let message:string = error.error.Message;
    console.log(error);
    if(error.error.Errors) {
      for(let i = 0; i < error.error.Errors.length; i++) {
        if(i === 0) {
          message = error.error.Errors[i];
          continue;
        }
        message += `\n\r${error.error.Errors[i]}`;
      }
    }
    console.log(error);
    return [message];
  }
}
