import { HttpErrorResponse } from "@angular/common/http";

export function ErrorHandler(error: HttpErrorResponse): string {
  if (error.error.message) {
    // Error thrown by client
    return error.error.message;
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
    return message;
  }
}
