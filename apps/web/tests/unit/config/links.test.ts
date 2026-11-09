import { describe, expect, it } from "vitest";

import { AUTHOR_LINKS, REPO_URL } from "@/config/links";

describe("링크 상수", () => {
  it("[저장소 링크]가 계약을 확인할 때 정확한 주소를 제공한다", () => {
    expect(REPO_URL).toBe(
      "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter",
    );
  });

  it("[작성자 링크]가 계약을 확인할 때 정확한 주소를 제공한다", () => {
    expect(AUTHOR_LINKS).toEqual({
      linkedin: "https://www.linkedin.com/in/bumkyu98/",
      github: "https://github.com/Kwon-Bum-Kyu",
      email: "mailto:missing107@gmail.com",
    });
  });
});
