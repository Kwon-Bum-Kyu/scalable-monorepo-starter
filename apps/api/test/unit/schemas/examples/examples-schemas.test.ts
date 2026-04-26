import { describe, expect, it } from "vitest";

import { createExampleSchema } from "../../../../src/schemas/examples/create";
import { idParamsSchema } from "../../../../src/schemas/examples/id-params";
import { listExamplesQuerySchema } from "../../../../src/schemas/examples/list-query";
import { updateExampleSchema } from "../../../../src/schemas/examples/update";

describe("examples schemas", () => {
  describe("createExampleSchema", () => {
    it("정상 입력은 통과한다", () => {
      const result = createExampleSchema.safeParse({
        title: "T",
        description: "D",
        status: "draft",
      });
      expect(result.success).toBe(true);
    });

    it("title이 121자일 때 검증에 실패한다", () => {
      const result = createExampleSchema.safeParse({
        title: "x".repeat(121),
      });
      expect(result.success).toBe(false);
    });

    it("title이 빈 문자열일 때 검증에 실패한다", () => {
      const result = createExampleSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });

    it("status가 enum 외 값일 때 검증에 실패한다", () => {
      const result = createExampleSchema.safeParse({
        title: "T",
        status: "archived",
      });
      expect(result.success).toBe(false);
    });

    it("description이 501자일 때 검증에 실패한다", () => {
      const result = createExampleSchema.safeParse({
        title: "T",
        description: "x".repeat(501),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateExampleSchema", () => {
    it("일부 필드만 있어도 통과한다", () => {
      const result = updateExampleSchema.safeParse({ title: "변경" });
      expect(result.success).toBe(true);
    });

    it("description에 null을 허용한다", () => {
      const result = updateExampleSchema.safeParse({ description: null });
      expect(result.success).toBe(true);
    });

    it("status가 enum 외 값일 때 검증에 실패한다", () => {
      const result = updateExampleSchema.safeParse({ status: "x" });
      expect(result.success).toBe(false);
    });
  });

  describe("listExamplesQuerySchema", () => {
    it("기본값으로 page=1, pageSize=20을 사용한다", () => {
      const result = listExamplesQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
      }
    });

    it("문자열 숫자를 number로 변환한다", () => {
      const result = listExamplesQuerySchema.safeParse({
        page: "2",
        pageSize: "30",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.pageSize).toBe(30);
      }
    });

    it("pageSize가 101일 때 검증에 실패한다", () => {
      const result = listExamplesQuerySchema.safeParse({ pageSize: 101 });
      expect(result.success).toBe(false);
    });

    it("page가 0일 때 검증에 실패한다", () => {
      const result = listExamplesQuerySchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe("idParamsSchema", () => {
    it("uuid 형식의 id는 통과한다", () => {
      const result = idParamsSchema.safeParse({
        id: "11111111-1111-4111-8111-111111111111",
      });
      expect(result.success).toBe(true);
    });

    it("id가 uuid 형식이 아닐 때 검증에 실패한다", () => {
      const result = idParamsSchema.safeParse({ id: "not-a-uuid" });
      expect(result.success).toBe(false);
    });
  });
});
