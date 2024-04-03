export interface ResponseType<T> {
  error?: string;
  data: T;
  errors?: string[];
  message: string;
  statusCode: number;
}
