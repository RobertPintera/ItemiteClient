export interface Product {
  id: string;
  name: string;
  categories: string[];
  image: string;
  isNegotiable: boolean;
  price: number;
  localization: string;
  dateOfIssue: string;
}
