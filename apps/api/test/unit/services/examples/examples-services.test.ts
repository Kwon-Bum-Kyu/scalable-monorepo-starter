import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../../../../src/errors/app-error";
import { createExample } from "../../../../src/services/examples/create-example";
import { deleteExample } from "../../../../src/services/examples/delete-example";
import { getExampleById } from "../../../../src/services/examples/get-example-by-id";
import { listExamples } from "../../../../src/services/examples/list-examples";
import { updateExample } from "../../../../src/services/examples/update-example";

vi.mock("../../../../src/repositories/examples/examples.repository", () => ({
  examplesRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const { examplesRepository } = await import(
  "../../../../src/repositories/examples/examples.repository"
);
const findAllMock = examplesRepository.findAll as unknown as ReturnType<
  typeof vi.fn
>;
const findByIdMock = examplesRepository.findById as unknown as ReturnType<
  typeof vi.fn
>;
const createMock = examplesRepository.create as unknown as ReturnType<
  typeof vi.fn
>;
const updateMock = examplesRepository.update as unknown as ReturnType<
  typeof vi.fn
>;
const deleteMock = examplesRepository.delete as unknown as ReturnType<
  typeof vi.fn
>;

const detail = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "예제",
  description: "설명",
  status: "draft" as const,
  createdAt: "2026-04-26T09:00:00.000Z",
  updatedAt: "2026-04-26T09:00:00.000Z",
};

describe("examples services", () => {
  beforeEach(() => {
    findAllMock.mockReset();
    findByIdMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
    deleteMock.mockReset();
  });

  describe("listExamples", () => {
    it("listExamples가 페이지네이션 meta를 반환한다", async () => {
      findAllMock.mockResolvedValueOnce({
        items: [
          {
            id: detail.id,
            title: detail.title,
            status: detail.status,
            createdAt: detail.createdAt,
          },
        ],
        total: 1,
      });

      const result = await listExamples({ page: 1, pageSize: 20 });

      expect(result.meta).toEqual({ total: 1, page: 1, pageSize: 20 });
      expect(result.items).toHaveLength(1);
    });
  });

  describe("getExampleById", () => {
    it("getExampleById가 존재하지 않는 id를 받으면 AppError(\"EXAMPLE_NOT_FOUND\", 404)를 throw한다", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(getExampleById(detail.id)).rejects.toBeInstanceOf(AppError);
      findByIdMock.mockResolvedValueOnce(null);
      await expect(getExampleById(detail.id)).rejects.toMatchObject({
        statusCode: 404,
        code: "EXAMPLE_NOT_FOUND",
      });
    });

    it("존재하는 id에 대해 상세를 반환한다", async () => {
      findByIdMock.mockResolvedValueOnce(detail);

      const result = await getExampleById(detail.id);

      expect(result).toEqual(detail);
    });
  });

  describe("createExample", () => {
    it("repository.create를 호출하고 결과를 반환한다", async () => {
      createMock.mockResolvedValueOnce(detail);

      const result = await createExample({
        title: "예제",
        description: "설명",
      });

      expect(createMock).toHaveBeenCalledWith({
        title: "예제",
        description: "설명",
      });
      expect(result).toEqual(detail);
    });
  });

  describe("updateExample", () => {
    it("updateExample이 빈 입력을 받으면 변경 없이 기존 엔티티를 반환한다", async () => {
      findByIdMock.mockResolvedValueOnce(detail);

      const result = await updateExample(detail.id, {});

      expect(result).toEqual(detail);
      expect(updateMock).not.toHaveBeenCalled();
    });

    it("존재하지 않는 id에 대해 EXAMPLE_NOT_FOUND를 throw한다", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(
        updateExample(detail.id, { title: "변경" }),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "EXAMPLE_NOT_FOUND",
      });
    });

    it("필드가 있을 때 repository.update를 호출한다", async () => {
      findByIdMock.mockResolvedValueOnce(detail);
      updateMock.mockResolvedValueOnce({ ...detail, title: "변경" });

      const result = await updateExample(detail.id, { title: "변경" });

      expect(updateMock).toHaveBeenCalledWith(detail.id, { title: "변경" });
      expect(result.title).toBe("변경");
    });
  });

  describe("deleteExample", () => {
    it("존재하지 않는 id에 대해 EXAMPLE_NOT_FOUND를 throw한다", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(deleteExample(detail.id)).rejects.toMatchObject({
        statusCode: 404,
        code: "EXAMPLE_NOT_FOUND",
      });
    });

    it("존재하는 id에 대해 repository.delete를 호출한다", async () => {
      findByIdMock.mockResolvedValueOnce(detail);
      deleteMock.mockResolvedValueOnce(undefined);

      await deleteExample(detail.id);

      expect(deleteMock).toHaveBeenCalledWith(detail.id);
    });
  });
});
