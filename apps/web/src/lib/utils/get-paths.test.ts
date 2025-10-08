import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useParams } from "react-router";
import getPaths, { usePath, useParentPath, useParentIdFromPath } from "./get-paths";
import * as store from "@store/store";

// Mock dependencies
vi.mock("react-router", () => ({
  useParams: vi.fn(),
}));

vi.mock("@store/slices/collections-slice", () => ({
  getAllCollections: vi.fn(),
}));

vi.mock("@store/store", () => ({
  useAppSelector: vi.fn(),
}));

describe("getPaths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPaths()", () => {
    it("should return ['Home'] when params wildcard is undefined", () => {
      vi.mocked(useParams).mockReturnValue({});

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home"]);
    });

    it("should return ['Home'] when params wildcard is empty string", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "" });

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home"]);
    });

    it("should return ['Home', 'collections'] for single path segment", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections" });

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home", "collections"]);
    });

    it("should return ['Home', 'collections', 'test'] for multiple path segments", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test" });

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home", "collections", "test"]);
    });

    it("should filter out empty segments from path", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections//test/" });

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home", "collections", "test"]);
    });

    it("should handle deeply nested paths", () => {
      vi.mocked(useParams).mockReturnValue({
        "*": "collections/test/app/hello",
      });

      const { result } = renderHook(() => getPaths());

      expect(result.current).toEqual(["Home", "collections", "test", "app", "hello"]);
    });

    it("should maintain referential stability when params don't change", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test" });

      const { result, rerender } = renderHook(() => getPaths());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });

  describe("usePath()", () => {
    beforeEach(() => {
      // Mock getPaths to return a controlled set of paths
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test/app" });
    });

    it("should return empty string for 'Home' label", () => {
      const { result } = renderHook(() => usePath("Home"));

      expect(result.current).toBe("");
    });

    it("should return path up to specified label", () => {
      const { result } = renderHook(() => usePath("test"));

      expect(result.current).toBe("collections/test");
    });

    it("should return partial path for first segment", () => {
      const { result } = renderHook(() => usePath("collections"));

      expect(result.current).toBe("collections");
    });

    it("should return full path for last segment", () => {
      const { result } = renderHook(() => usePath("app"));

      expect(result.current).toBe("collections/test/app");
    });

    it("should return empty string when label is not found", () => {
      const { result } = renderHook(() => usePath("nonexistent"));

      expect(result.current).toBe("");
    });

    it("should handle case when label appears multiple times (uses first occurrence)", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "test/collections/test" });

      const { result } = renderHook(() => usePath("test"));

      expect(result.current).toBe("test");
    });
  });

  describe("useParentPath()", () => {
    it("should return null when current path is Home (root)", () => {
      vi.mocked(useParams).mockReturnValue({});

      const { result } = renderHook(() => useParentPath());

      expect(result.current).toBeNull();
    });

    it("should return last path segment when not at root", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections" });

      const { result } = renderHook(() => useParentPath());

      expect(result.current).toBe("collections");
    });

    it("should return last segment for deeply nested paths", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test/app" });

      const { result } = renderHook(() => useParentPath());

      expect(result.current).toBe("app");
    });

    it("should maintain referential stability when params don't change", () => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test" });

      const { result, rerender } = renderHook(() => useParentPath());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });

  describe("useParentIdFromPath()", () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({ "*": "collections/test" });
    });

    it("should call useAppSelector with correct selector", () => {
      const mockSelector = vi.fn().mockReturnValue("mock-id");
      vi.mocked(store.useAppSelector).mockImplementation(mockSelector);

      renderHook(() => useParentIdFromPath());

      expect(store.useAppSelector).toHaveBeenCalled();
    });

    it("should return the parent ID from selector", () => {
      const mockId = "parent-collection-id";
      vi.mocked(store.useAppSelector).mockReturnValue(mockId);

      const { result } = renderHook(() => useParentIdFromPath());

      expect(result.current).toBe(mockId);
    });

    it("should return undefined when no matching parent found", () => {
      vi.mocked(store.useAppSelector).mockReturnValue(undefined);

      const { result } = renderHook(() => useParentIdFromPath());

      expect(result.current).toBeUndefined();
    });

    it("should return null for root path", () => {
      vi.mocked(useParams).mockReturnValue({});
      vi.mocked(store.useAppSelector).mockReturnValue(null);

      const { result } = renderHook(() => useParentIdFromPath());

      expect(result.current).toBeNull();
    });
  });
});
