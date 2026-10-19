import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/lib/prisma", () => {
  const store = new Map<string, ExampleRow>();

  const isoNow = () => new Date();

  type ExampleRow = {
    id: string;
    title: string;
    description: string | null;
    status: "draft" | "published";
    createdAt: Date;
    updatedAt: Date;
  };

  function applyOrder(rows: ExampleRow[]): ExampleRow[] {
    return [...rows].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status < b.status ? -1 : 1;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  return {
    prisma: {
      example: {
        findMany: vi.fn(
          async (args?: {
            where?: { status?: "draft" | "published" };
            skip?: number;
            take?: number;
          }) => {
            let rows = Array.from(store.values());
            if (args?.where?.status) {
              rows = rows.filter((row) => row.status === args.where!.status);
            }
            rows = applyOrder(rows);
            const skip = args?.skip ?? 0;
            const take = args?.take ?? rows.length;
            return rows.slice(skip, skip + take);
          },
        ),
        count: vi.fn(
          async (args?: { where?: { status?: "draft" | "published" } }) => {
            let rows = Array.from(store.values());
            if (args?.where?.status) {
              rows = rows.filter((row) => row.status === args.where!.status);
            }
            return rows.length;
          },
        ),
        findUnique: vi.fn(async (args: { where: { id: string } }) => {
          return store.get(args.where.id) ?? null;
        }),
        create: vi.fn(
          async (args: {
            data: {
              title: string;
              description?: string | null;
              status?: "draft" | "published";
            };
          }) => {
            const id = `00000000-0000-4000-8000-${String(store.size + 1).padStart(12, "0")}`;
            const row: ExampleRow = {
              id,
              title: args.data.title,
              description: args.data.description ?? null,
              status: args.data.status ?? "draft",
              createdAt: isoNow(),
              updatedAt: isoNow(),
            };
            store.set(id, row);
            return row;
          },
        ),
        update: vi.fn(
          async (args: {
            where: { id: string };
            data: {
              title?: string;
              description?: string | null;
              status?: "draft" | "published";
            };
          }) => {
            const existing = store.get(args.where.id);
            if (!existing) {
              throw new Error("not found");
            }
            const updated: ExampleRow = {
              ...existing,
              ...(args.data.title !== undefined
                ? { title: args.data.title }
                : {}),
              ...(args.data.description !== undefined
                ? { description: args.data.description }
                : {}),
              ...(args.data.status !== undefined
                ? { status: args.data.status }
                : {}),
              updatedAt: isoNow(),
            };
            store.set(args.where.id, updated);
            return updated;
          },
        ),
        delete: vi.fn(async (args: { where: { id: string } }) => {
          const existing = store.get(args.where.id);
          if (!existing) {
            throw new Error("not found");
          }
          store.delete(args.where.id);
          return existing;
        }),
      },
      __reset: () => store.clear(),
    },
  };
});

const { prisma } = await import("../../src/lib/prisma");
const prismaWithReset = prisma as unknown as { __reset: () => void };

let app: import("express").Express;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.ENABLE_EXAMPLES = "true";
  vi.resetModules();
  const mod = await import("../../src/app");
  app = mod.default;
});

beforeEach(() => {
  prismaWithReset.__reset();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Examples API", () => {
  it("POST /api/v1/examples 성공 시 201을 반환한다", async () => {
    const response = await request(app)
      .post("/api/v1/examples")
      .send({ title: "첫 번째", description: "설명" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      title: "첫 번째",
      description: "설명",
      status: "draft",
    });
  });

  it("POST /api/v1/examples title 누락 시 400을 반환한다", async () => {
    const response = await request(app)
      .post("/api/v1/examples")
      .send({ description: "설명" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
  });

  it("GET /api/v1/examples 응답의 meta에 total·page·pageSize가 포함된다", async () => {
    await request(app).post("/api/v1/examples").send({ title: "A" });
    await request(app).post("/api/v1/examples").send({ title: "B" });

    const response = await request(app).get(
      "/api/v1/examples?page=1&pageSize=20",
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toEqual({ total: 2, page: 1, pageSize: 20 });
  });

  it("GET /api/v1/examples/:id 존재하지 않는 id에 대해 404를 반환한다", async () => {
    const response = await request(app).get(
      "/api/v1/examples/11111111-1111-4111-8111-111111111111",
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "EXAMPLE_NOT_FOUND" },
    });
  });

  it("GET /api/v1/examples/:id id가 uuid가 아니면 400을 반환한다", async () => {
    const response = await request(app).get("/api/v1/examples/not-uuid");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
  });

  it("PATCH /api/v1/examples/:id 성공 시 200을 반환한다", async () => {
    const created = await request(app)
      .post("/api/v1/examples")
      .send({ title: "원본" });
    const id = created.body.data.id as string;

    const response = await request(app)
      .patch(`/api/v1/examples/${id}`)
      .send({ title: "변경됨" });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("변경됨");
  });

  it("DELETE /api/v1/examples/:id 성공 시 204를 반환한다", async () => {
    const created = await request(app)
      .post("/api/v1/examples")
      .send({ title: "삭제 대상" });
    const id = created.body.data.id as string;

    const response = await request(app).delete(`/api/v1/examples/${id}`);

    expect(response.status).toBe(204);

    const after = await request(app).get(`/api/v1/examples/${id}`);
    expect(after.status).toBe(404);
  });

  it("POST /api/v1/examples title이 121자일 때 400을 반환한다", async () => {
    const response = await request(app)
      .post("/api/v1/examples")
      .send({ title: "x".repeat(121) });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "VALIDATION_ERROR" },
    });
  });
});
