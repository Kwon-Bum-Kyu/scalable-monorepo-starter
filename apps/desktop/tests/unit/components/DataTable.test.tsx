import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DataTable from "@/components/DataTable";

describe("DataTable", () => {
  it("[공용 데이터 표]가 렌더될 때 열 머리와 본문을 표시한다", () => {
    render(
      <DataTable head={["이름", "값"]}>
        <tr>
          <td>서비스</td>
          <td>주소</td>
        </tr>
      </DataTable>,
    );

    expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
      "이름",
      "값",
    ]);
    expect(screen.getByRole("table")).toHaveClass("w-full", "text-sm");
  });
});
