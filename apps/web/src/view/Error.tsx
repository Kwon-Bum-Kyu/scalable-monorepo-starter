import { cn } from "@repo/ui";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

type Error = {
  status: number;
  statusText: string;
  internal: boolean;
  data: string;
  error: object;
};

// const render = (error: Error) => {
//   const { status, statusText } = error;

//   switch (status) {
//     case 404:
//       return <div>{statusText}</div>;
//     default:
//       return <div>{statusText}</div>;
//   }
// };

type ErrorPageProps = {
  isError?: boolean;
  text?: string;
  className?: string;
};

/**
 * 라우팅 에러를 처리하는 페이지
 */
const ErrorPage = ({ isError, className }: ErrorPageProps) => {
  const error = useRouteError() as Error;
  isError = isError || isRouteErrorResponse(error);

  if (!isError) return;

  return (
    <main
      id="error-page"
      className={cn(
        "flex h-screen w-screen flex-col items-center justify-center text-center",
        className,
      )}
    >
      <h3 className="mt-7 text-lg font-bold">찾으시는 페이지가 없습니다.</h3>
      <p className="c-b2 w-container-error-text mt-4 text-gray-700">
        페이지가 삭제되었거나 주소가 변경되어 요청하신 페이지를 찾을 수
        없습니다. 입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
      </p>
    </main>
  );
};

export default ErrorPage;
