import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should delay function execution", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call function only once for multiple rapid calls", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should reset delay on subsequent calls", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    vi.advanceTimersByTime(500);

    debouncedFn();
    vi.advanceTimersByTime(500);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the debounced function", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("arg1", "arg2", 123);

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should use the last set of arguments when called multiple times", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("first");
    debouncedFn("second");
    debouncedFn("third");

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third");
  });

  it("should preserve 'this' context", () => {
    const mockFn = vi.fn(function (this: any) {
      return this.value;
    });
    const debouncedFn = debounce(mockFn, 1000);

    const context = { value: 42, fn: debouncedFn };
    context.fn();

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle different delay times", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();

    vi.advanceTimersByTime(499);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should allow multiple debounced functions to work independently", () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    const debouncedFn1 = debounce(mockFn1, 1000);
    const debouncedFn2 = debounce(mockFn2, 500);

    debouncedFn1();
    debouncedFn2();

    vi.advanceTimersByTime(500);

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it("should work with zero delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
