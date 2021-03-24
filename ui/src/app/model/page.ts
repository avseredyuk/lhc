export class Page<T> {
  content: Array<T>;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  sort: string;
  numberOfElements: number;
}