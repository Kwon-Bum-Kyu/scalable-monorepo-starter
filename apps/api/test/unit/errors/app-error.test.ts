import { describe, expect, it } from "vitest";

import { AppError } from "../../../src/errors/app-error";

describe("AppError", () => {
  it("message와 statusCode와 code를 인자로 받으면 인스턴스 속성에 보존된다", () => {
    const error = new AppError("유저 없음", 404, "USER_NOT_FOUND");

    expect(error.message).toBe("유저 없음");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("USER_NOT_FOUND");
    expect(error.name).toBe("AppError");
  });

  it("toApiError 호출 시 message와 code를 포함한 ApiError 형태를 반환한다", () => {
    const error = new AppError("잘못된 요청", 400, "BAD_REQUEST");

    expect(error.toApiError()).toEqual({
      message: "잘못된 요청",
      code: "BAD_REQUEST",
    });
  });

  it("new AppError(...) 생성 시 details를 인자로 받으면 error.details에 그대로 보존된다", () => {
    const details = { field: "email", reason: "이미 사용 중" };
    const error = new AppError("검증 실패", 422, "VALIDATION_FAILED", details);

    expect(error.details).toEqual(details);
  });

  it("details 인자를 생략하면 error.details는 undefined다", () => {
    const error = new AppError("내부 오류", 500, "INTERNAL_SERVER_ERROR");

    expect(error.details).toBeUndefined();
  });

  it("details가 주어지면 toApiError 결과에도 동일하게 포함된다", () => {
    const details = [{ path: "name", message: "필수 항목" }];
    const error = new AppError("검증 실패", 422, "VALIDATION_FAILED", details);

    expect(error.toApiError()).toEqual({
      message: "검증 실패",
      code: "VALIDATION_FAILED",
      details,
    });
  });

  it("details가 없으면 toApiError 결과에 details 키가 포함되지 않는다", () => {
    const error = new AppError("잘못된 요청", 400, "BAD_REQUEST");

    expect(error.toApiError()).not.toHaveProperty("details");
  });
});
