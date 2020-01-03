export class ApiResult<T> {
  data: T;
  errors: Array<string>;
}