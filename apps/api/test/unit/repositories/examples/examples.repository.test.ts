import { beforeEach, describe, expect, it, vi } from "vitest";

import { examplesRepository } from "../../../../src/repositories/examples/examples.repository";

vi.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    example: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const { prisma } = await import("../../../../src/lib/prisma");
const findManyMock = prisma.example.findMany as unknown as ReturnType<
  typeof vi.fn
>;
const countMock = prisma.example.count as unknown as ReturnType<typeof vi.fn>;
const findUniqueMock = prisma.example.findUnique as unknown as ReturnType<
  typeof vi.fn
>;
const createMock = prisma.example.create as unknown as ReturnType<typeof vi.fn>;
const updateMock = prisma.example.update as unknown as ReturnType<typeof vi.fn>;
const deleteMock = prisma.example.delete as unknown as ReturnType<typeof vi.fn>;
const transactionMock = prisma.$transaction as unknown as ReturnType<
  typeof vi.fn
>;

const baseRow = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "첫 번째 예제",
  description: "설명",
  status: "draft" as const,
  createdAt: new Date("2026-04-26T09:00:00.000Z"),
  updatedAt: new Date("2026-04-26T09:30:00.000Z"),
};

describe("examplesRepository", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    countMock.mockReset();
    findUniqueMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
    deleteMock.mockReset();
    transactionMock.mockReset();
    transactionMock.mockImplementation(async (calls: Promise<unknown>[]) =>
      Promise.all(calls),
    );
  });

  describe("findAll", () => {
    it("list 조회 시 status·createdAt 인덱스 정렬로 페이지네이션된 결과를 반환한다", async () => {
      findManyMock.mockResolvedValueOnce([baseRow]);
      countMock.mockResolvedValueOnce(1);

      const result = await examplesRepository.findAll({
        page: 1,
        pageSize: 20,
      });

      expect(findManyMock).toHaveBeenCalledTimes(1);
      const args = findManyMock.mock.calls[0]![0];
      expect(args.orderBy).toEqual([{ status: "asc" }, { createdAt: "desc" }]);
      expect(args.skip).toBe(0);
      expect(args.take).toBe(20);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: baseRow.id,
        title: baseRow.title,
        status: "draft",
        createdAt: "2026-04-26T09:00:00.000Z",
      });
      expect(result.total).toBe(1);
    });

    it("list 응답이 total을 포함한다", async () => {
      findManyMock.mockResolvedValueOnce([]);
      countMock.mockResolvedValueOnce(42);

      const result = await examplesRepository.findAll({
        page: 2,
        pageSize: 10,
      });

      expect(result.total).toBe(42);
      const args = findManyMock.mock.calls[0]![0];
      expect(args.skip).toBe(10);
      expect(args.take).toBe(10);
    });

    it("status 필터가 주어지면 where에 반영한다", async () => {
      findManyMock.mockResolvedValueOnce([]);
      countMock.mockResolvedValueOnce(0);

      await examplesRepository.findAll({
        page: 1,
        pageSize: 20,
        status: "published",
      });

      const args = findManyMock.mock.calls[0]![0];
      expect(args.where).toEqual({ status: "published" });
    });
  });

  describe("findById", () => {
    it("findById가 존재하지 않는 id에 대해 null을 반환한다", async () => {
      findUniqueMock.mockResolvedValueOnce(null);

      const result = await examplesRepository.findById(
        "22222222-2222-2222-2222-222222222222",
      );

      expect(result).toBeNull();
    });

    it("존재하는 id에 대해 상세 DTO를 반환한다", async () => {
      findUniqueMock.mockResolvedValueOnce(baseRow);

      const result = await examplesRepository.findById(baseRow.id);

      expect(result).toEqual({
        id: baseRow.id,
        title: baseRow.title,
        description: baseRow.description,
        status: "draft",
        createdAt: "2026-04-26T09:00:00.000Z",
        updatedAt: "2026-04-26T09:30:00.000Z",
      });
    });
  });

  describe("create", () => {
    it("create 시 createdAt·updatedAt이 자동 설정된다", async () => {
      createMock.mockResolvedValueOnce(baseRow);

      const result = await examplesRepository.create({
        title: "첫 번째 예제",
        description: "설명",
        status: "draft",
      });

      expect(createMock).toHaveBeenCalledTimes(1);
      const args = createMock.mock.calls[0]![0];
      expect(args.data.createdAt).toBeUndefined();
      expect(args.data.updatedAt).toBeUndefined();
      expect(result.createdAt).toBe("2026-04-26T09:00:00.000Z");
      expect(result.updatedAt).toBe("2026-04-26T09:30:00.000Z");
    });
  });

  describe("update", () => {
    it("주어진 필드만 update에 전달한다", async () => {
      updateMock.mockResolvedValueOnce({ ...baseRow, title: "변경됨" });

      const result = await examplesRepository.update(baseRow.id, {
        title: "변경됨",
      });

      const args = updateMock.mock.calls[0]![0];
      expect(args.where).toEqual({ id: baseRow.id });
      expect(args.data).toEqual({ title: "변경됨" });
      expect(result.title).toBe("변경됨");
    });
  });

  describe("delete", () => {
    it("delete 호출 시 prisma delete를 호출한다", async () => {
      deleteMock.mockResolvedValueOnce(baseRow);

      await examplesRepository.delete(baseRow.id);

      expect(deleteMock).toHaveBeenCalledWith({ where: { id: baseRow.id } });
    });
  });
});
