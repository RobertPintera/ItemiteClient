import {LocationDTO} from './LocationDTO';

export interface User {
  id: number,
  userName: string,
  email: string,
  location: LocationDTO | undefined,
  phoneNumber: string | undefined,
  photoUrl: string | undefined,
  backgroundUrl: string | undefined
}
