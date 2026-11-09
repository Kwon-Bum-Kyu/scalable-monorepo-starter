import { Button, cn } from "@repo/ui";
import {
  isRouteErrorResponse,
  Link,
  useRouteError,
} from "react-router-dom";

import PageContainer from "@/components/layouts/PageContainer";

export type ErrorPageVariant = "not-found" | "route-error";

export interface ErrorPageProps {
  variant?: ErrorPageVariant;
}

const CONTENT = {
  "not-found": {
    label: "404",
    title: "페이지를 찾을 수 없습니다.",
    description:
      "페이지가 삭제되었거나 주소가 바뀌었습니다. 입력하신 주소가 정확한지 확인해 주세요.",
  },
  "route-error": {
    label: "오류",
    title: "페이지를 표시하지 못했습니다.",
    description:
      "페이지를 불러오는 중에 문제가 생겼습니다. 다시 시도해도 같은 화면이 보이면 홈으로 이동해 주세요.",
  },
} as const;

export default function ErrorPage({ variant }: ErrorPageProps): React.JSX.Element {
  const error = useRouteError();
  const resolved =
    variant ??
    (isRouteErrorResponse(error) && error.status === 404
      ? "not-found"
      : "route-error");
  const content = CONTENT[resolved];

  return (
    <PageContainer>
      <div
        id="error-page"
        role={resolved === "route-error" ? "alert" : undefined}
        className="mx-auto grid max-w-error-text justify-items-center gap-4 py-20 text-center tablet:py-32"
      >
        <p
          className={cn(
            "text-sm font-bold tracking-eyebrow text-muted-foreground",
            resolved === "not-found" ? "font-display" : "font-sans",
          )}
        >
          {content.label}
        </p>
        <h1 className="text-2xl font-bold tablet:text-3xl">{content.title}</h1>
        <p className="text-muted-foreground">{content.description}</p>
        <div className="mt-4 flex w-full flex-col gap-3 tablet:w-auto tablet:flex-row tablet:flex-wrap tablet:justify-center">
          {resolved === "not-found" ? (
            <Button asChild size="lg">
              <Link to="/">홈으로</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => window.location.reload()}>
                다시 시도
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">홈으로</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
