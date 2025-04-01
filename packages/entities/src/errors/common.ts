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
  constructor(message: string) {
    super(message);
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}
