export interface GeoapifyResponseSearchDTO {
  results: {
    city?: string;
    state?: string;
    country?: string;
    formatted: string;
    lat: number;
    lon: number;
  }[];
}
