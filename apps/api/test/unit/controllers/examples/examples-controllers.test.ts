import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createExampleController } from "../../../../src/controllers/examples/create-example-controller";
import { deleteExampleController } from "../../../../src/controllers/examples/delete-example-controller";
import { getExampleByIdController } from "../../../../src/controllers/examples/get-example-by-id-controller";
import { listExamplesController } from "../../../../src/controllers/examples/list-examples-controller";
import { updateExampleController } from "../../../../src/controllers/examples/update-example-controller";

vi.mock("../../../../src/services/examples/list-examples", () => ({
  listExamples: vi.fn(),
}));
vi.mock("../../../../src/services/examples/get-example-by-id", () => ({
  getExampleById: vi.fn(),
}));
vi.mock("../../../../src/services/examples/create-example", () => ({
  createExample: vi.fn(),
}));
vi.mock("../../../../src/services/examples/update-example", () => ({
  updateExample: vi.fn(),
}));
vi.mock("../../../../src/services/examples/delete-example", () => ({
  deleteExample: vi.fn(),
}));

const { listExamples } = await import(
  "../../../../src/services/examples/list-examples"
);
const { getExampleById } = await import(
  "../../../../src/services/examples/get-example-by-id"
);
const { createExample } = await import(
  "../../../../src/services/examples/create-example"
);
const { updateExample } = await import(
  "../../../../src/services/examples/update-example"
);
const { deleteExample } = await import(
  "../../../../src/services/examples/delete-example"
);

const listExamplesMock = listExamples as unknown as ReturnType<typeof vi.fn>;
const getExampleByIdMock = getExampleById as unknown as ReturnType<typeof vi.fn>;
const createExampleMock = createExample as unknown as ReturnType<typeof vi.fn>;
const updateExampleMock = updateExample as unknown as ReturnType<typeof vi.fn>;
const deleteExampleMock = deleteExample as unknown as ReturnType<typeof vi.fn>;

const makeResponse = (validated: Record<string, unknown> = {}) => {
  const json = vi.fn();
  const send = vi.fn();
  const status = vi.fn(() => ({ json, send }));
  return {
    status,
    json,
    send,
    locals: { validated },
  } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
  };
};

const detail = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "예제",
  description: "설명",
  status: "draft" as const,
  createdAt: "2026-04-26T09:00:00.000Z",
  updatedAt: "2026-04-26T09:00:00.000Z",
};

describe("examples controllers", () => {
  beforeEach(() => {
    listExamplesMock.mockReset();
    getExampleByIdMock.mockReset();
    createExampleMock.mockReset();
    updateExampleMock.mockReset();
    deleteExampleMock.mockReset();
  });

  it("list 응답의 meta에 total·page·pageSize가 포함된다", async () => {
    listExamplesMock.mockResolvedValueOnce({
      items: [],
      meta: { total: 0, page: 1, pageSize: 20 },
    });
    const response = makeResponse({ query: { page: 1, pageSize: 20 } });

    await listExamplesController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    const body = response.json.mock.calls[0]![0];
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.meta).toEqual({ total: 0, page: 1, pageSize: 20 });
  });

  it("getById 성공 시 200을 반환한다", async () => {
    getExampleByIdMock.mockResolvedValueOnce(detail);
    const response = makeResponse({ params: { id: detail.id } });

    await getExampleByIdController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: detail,
    });
  });

  it("create 성공 시 201을 반환한다", async () => {
    createExampleMock.mockResolvedValueOnce(detail);
    const response = makeResponse({
      body: { title: "예제", description: "설명" },
    });

    await createExampleController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: detail,
    });
  });

  it("update 성공 시 200을 반환한다", async () => {
    updateExampleMock.mockResolvedValueOnce(detail);
    const response = makeResponse({
      params: { id: detail.id },
      body: { title: "변경" },
    });

    await updateExampleController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: detail,
    });
  });

  it("delete 성공 시 204를 반환한다", async () => {
    deleteExampleMock.mockResolvedValueOnce(undefined);
    const response = makeResponse({ params: { id: detail.id } });

    await deleteExampleController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
  });
});
