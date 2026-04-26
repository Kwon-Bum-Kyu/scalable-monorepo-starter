import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { AppError } from "../../../src/errors/app-error";
import { requireAuth } from "../../../src/middlewares/require-auth";

describe("requireAuth (빈 슬롯)", () => {
  it("기본 호출 시 AUTH_NOT_CONFIGURED 501을 throw한다", () => {
    const request = {} as Request;
    const response = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    expect(() => requireAuth(request, response, next)).toThrow(AppError);

    try {
      requireAuth(request, response, next);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      const appError = error as AppError;
      expect(appError.statusCode).toBe(501);
      expect(appError.code).toBe("AUTH_NOT_CONFIGURED");
    }
  });

  it("에러 객체의 details에 recipe 안내가 포함된다", () => {
    const request = {} as Request;
    const response = {} as Response;
    const next = vi.fn() as unknown as NextFunction;

    try {
      requireAuth(request, response, next);
    } catch (error) {
      const appError = error as AppError;
      expect(appError.details).toMatchObject({
        recipes: expect.arrayContaining([
          "auth-better-auth",
          "auth-lucia",
          "auth-clerk",
        ]),
      });
    }
  });
});
