import { HttpErrorResponse } from "@angular/common/http";

export function ErrorHandler(error: HttpErrorResponse): string {
  // todo maybe do something with status code?

  if (error.error.message) {
    // Error thrown by client
    const message = error.error.message;
    return message;
  } else {
    // Error thrown by API
    const statusCode:string = error.error.StatusCode;
    const message:string = error.error.Message;
    return message;
  }

}
