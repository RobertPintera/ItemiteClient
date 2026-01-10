import {TranslateService} from '@ngx-translate/core';
import {lastValueFrom} from 'rxjs';

export async function TranslateApiError(errorMessage: string, translate: TranslateService) : Promise<string> {
  let translation:string | undefined;

  if(errorMessage.startsWith("Payments must be disputed within")) {
    translation = await lastValueFrom<string | undefined>(
      translate.get("api_errors.Payments_must_be_disputed_within")
    );
    return translation ?? errorMessage;
  }

  if(errorMessage.startsWith("Category with id:")) {
    translation = await lastValueFrom<string | undefined>(
      translate.get("api_errors.Category_not_found")
    );
    return translation ?? errorMessage;
  }

  if(errorMessage.startsWith("Listing with id:")
    || errorMessage.startsWith("Product listing with id:")
    || errorMessage.startsWith("Auction with id:")
  ) {
    translation = await lastValueFrom<string | undefined>(
      translate.get("api_errors.Listing_with_id")
    );
    return translation ?? errorMessage;
  }

  const query = errorMessage.replace(/\s/g, "_");

  translation = await lastValueFrom<string | undefined>(
    translate.get(`api_errors.${query}`)
  );

  return translation === undefined || translation === "" ? errorMessage : translation;
}
