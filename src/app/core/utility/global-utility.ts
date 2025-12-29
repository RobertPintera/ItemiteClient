import {DEFAULT_PROFILE_IMAGE} from '../constants/constants';

export function imageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = DEFAULT_PROFILE_IMAGE;
}
