export interface HasuraActionRequest<T = any> {
  action: { name: string };
  input: T;
  session_variables: Record<string, string>;
  request_query: string;
}

export type HasuraActionResponse<T = any> = T | HasuraActionError;

export interface HasuraActionError {
  message: string;
  extensions?: { code?: string; path?: string };
}
