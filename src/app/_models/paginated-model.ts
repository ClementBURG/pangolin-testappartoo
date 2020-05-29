export class PaginatedModel<T> {
  docs: T[];
  page: number;
  pages: number;
  limit: number;
  total: number;
}
