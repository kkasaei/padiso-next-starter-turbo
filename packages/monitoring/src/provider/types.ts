export interface ErrorRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

export interface ErrorContext {
  routerKind?: string;
  routePath?: string;
  routeType?: string;
}

export interface MonitoringProvider {
  withConfig<C>(nextConfig: C): C;
  register(): Promise<void>;
  captureRequestError(
    error: unknown,
    errorRequest: Readonly<ErrorRequest>,
    errorContext: Readonly<ErrorContext>
  ): void;
  captureError(error: unknown): void;
  captureEvent<Extra extends object>(event: string, extra?: Extra): void;
  setUser<Info extends { id: string }>(user: Info): void;
}
