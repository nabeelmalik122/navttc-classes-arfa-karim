export type ID = string;
export type ISODateString = string;

export type Nullable<T> = T | null;

export interface BaseEntity {
  id: ID;
  createdAt: ISODateString | Date;
  updatedAt: ISODateString | Date;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
