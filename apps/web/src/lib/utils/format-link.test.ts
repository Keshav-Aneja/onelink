import { describe, it, expect } from "vitest";
import formatLink from "./format-link";

describe("formatLink", () => {
  describe("URLs with http/https protocol", () => {
    it("should extract domain from http URL", () => {
      const result = formatLink("http://example.com");
      expect(result).toBe("example.com");
    });

    it("should extract domain from https URL", () => {
      const result = formatLink("https://example.com");
      expect(result).toBe("example.com");
    });

    it("should remove www from http URL", () => {
      const result = formatLink("http://www.example.com");
      expect(result).toBe("example");
    });

    it("should remove www from https URL", () => {
      const result = formatLink("https://www.example.com");
      expect(result).toBe("example");
    });

    it("should handle URLs with paths", () => {
      const result = formatLink("https://www.example.com/path/to/page");
      expect(result).toBe("example");
    });

    it("should handle URLs with query parameters", () => {
      const result = formatLink("https://www.example.com/page?param=value");
      expect(result).toBe("example");
    });

    it("should handle URLs with fragments", () => {
      const result = formatLink("https://www.example.com/page#section");
      expect(result).toBe("example");
    });

    it("should handle URLs without www", () => {
      const result = formatLink("https://github.com/user/repo");
      expect(result).toBe("github.com");
    });

    it("should handle subdomains", () => {
      const result = formatLink("https://api.example.com");
      expect(result).toBe("api.example.com");
    });

    it("should handle subdomains with www", () => {
      const result = formatLink("https://www.api.example.com");
      expect(result).toBe("api");
    });
  });

  describe("URLs without protocol", () => {
    it("should handle domain without protocol", () => {
      const result = formatLink("example.com");
      expect(result).toBe("example.com");
    });

    it("should remove www from domain without protocol", () => {
      const result = formatLink("www.example.com");
      expect(result).toBe("example");
    });

    it("should handle domain with path without protocol", () => {
      const result = formatLink("www.example.com/path/to/page");
      expect(result).toBe("example");
    });

    it("should handle domain without www and without protocol", () => {
      const result = formatLink("github.com/user/repo");
      expect(result).toBe("github.com");
    });

    it("should handle subdomain without protocol", () => {
      const result = formatLink("api.example.com");
      expect(result).toBe("api.example.com");
    });
  });

  describe("edge cases", () => {
    it("should handle localhost with protocol", () => {
      const result = formatLink("http://localhost:3000");
      expect(result).toBe("localhost:3000");
    });

    it("should handle localhost without protocol", () => {
      const result = formatLink("localhost:3000");
      expect(result).toBe("localhost:3000");
    });

    it("should handle IP address with protocol", () => {
      const result = formatLink("http://192.168.1.1");
      expect(result).toBe("192.168.1.1");
    });

    it("should handle IP address without protocol", () => {
      const result = formatLink("192.168.1.1");
      expect(result).toBe("192.168.1.1");
    });

    it("should handle domains with ports", () => {
      const result = formatLink("https://example.com:8080");
      expect(result).toBe("example.com:8080");
    });

    it("should handle www with ports", () => {
      const result = formatLink("https://www.example.com:8080");
      expect(result).toBe("example");
    });

    it("should handle URLs with only http", () => {
      const result = formatLink("http://www.google.com");
      expect(result).toBe("google");
    });

    it("should handle URLs with httpx (contains http)", () => {
      const result = formatLink("httpx://www.example.com");
      expect(result).toBe("example");
    });

    it("should handle single word domains", () => {
      const result = formatLink("localhost");
      expect(result).toBe("localhost");
    });
  });
});
