export class DatabaseOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class SessionOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
