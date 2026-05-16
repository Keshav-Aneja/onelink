export class DatabaseOperationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SessionOperationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}
