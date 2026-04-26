/**
 * Example 도메인 타입 정의
 *
 * 런타임 코드 금지 — 순수 타입/interface/string literal union만.
 * Date 객체 금지 — 모든 일시는 ISO 8601 string으로 표기.
 */

export type ExampleStatus = "draft" | "published";

export interface ExampleListItem {
  id: string;
  title: string;
  status: ExampleStatus;
  /** ISO 8601 timestamp */
  createdAt: string;
}

export interface ExampleDetail {
  id: string;
  title: string;
  description: string | null;
  status: ExampleStatus;
  /** ISO 8601 timestamp */
  createdAt: string;
  /** ISO 8601 timestamp */
  updatedAt: string;
}

export interface CreateExampleInput {
  title: string;
  description?: string;
  status?: ExampleStatus;
}

export interface UpdateExampleInput {
  title?: string;
  description?: string | null;
  status?: ExampleStatus;
}

export interface ExampleListQuery {
  page?: number;
  pageSize?: number;
  status?: ExampleStatus;
}
