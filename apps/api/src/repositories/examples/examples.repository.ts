import type {
  ExampleDetail,
  ExampleListItem,
  ExampleStatus,
} from "@repo/shared-types";

import { prisma } from "../../lib/prisma";

interface ExampleRow {
  id: string;
  title: string;
  description: string | null;
  status: ExampleStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface FindAllParams {
  page: number;
  pageSize: number;
  status?: ExampleStatus;
}

interface FindAllResult {
  items: ExampleListItem[];
  total: number;
}

interface CreateParams {
  title: string;
  description?: string | null;
  status?: ExampleStatus;
}

interface UpdateParams {
  title?: string;
  description?: string | null;
  status?: ExampleStatus;
}

function toListItem(row: ExampleRow): ExampleListItem {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

function toDetail(row: ExampleRow): ExampleDetail {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function findAll(params: FindAllParams): Promise<FindAllResult> {
  const { page, pageSize, status } = params;
  const where = status ? { status } : undefined;
  const skip = (page - 1) * pageSize;

  const [rows, total] = await Promise.all([
    prisma.example.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.example.count({ where }),
  ]);

  return {
    items: (rows as ExampleRow[]).map(toListItem),
    total,
  };
}

async function findById(id: string): Promise<ExampleDetail | null> {
  const row = (await prisma.example.findUnique({
    where: { id },
  })) as ExampleRow | null;
  if (!row) {
    return null;
  }
  return toDetail(row);
}

async function create(params: CreateParams): Promise<ExampleDetail> {
  const data: CreateParams = {
    title: params.title,
  };
  if (params.description !== undefined) {
    data.description = params.description;
  }
  if (params.status !== undefined) {
    data.status = params.status;
  }
  const row = (await prisma.example.create({ data })) as ExampleRow;
  return toDetail(row);
}

async function update(
  id: string,
  params: UpdateParams,
): Promise<ExampleDetail> {
  const data: UpdateParams = {};
  if (params.title !== undefined) data.title = params.title;
  if (params.description !== undefined) data.description = params.description;
  if (params.status !== undefined) data.status = params.status;

  const row = (await prisma.example.update({
    where: { id },
    data,
  })) as ExampleRow;
  return toDetail(row);
}

async function deleteById(id: string): Promise<void> {
  await prisma.example.delete({ where: { id } });
}

export const examplesRepository = {
  findAll,
  findById,
  create,
  update,
  delete: deleteById,
};
