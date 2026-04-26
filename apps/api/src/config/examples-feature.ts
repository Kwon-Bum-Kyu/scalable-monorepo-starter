interface ExamplesFeatureEnv {
  NODE_ENV: "development" | "test" | "production";
  ENABLE_EXAMPLES: boolean;
}

/**
 * examples 도메인 라우터를 마운트할지 결정한다.
 * - NODE_ENV가 production이면 항상 false (배포 환경 보호)
 * - 그 외 환경에서는 ENABLE_EXAMPLES 값을 따른다
 */
export function isExamplesEnabled(env: ExamplesFeatureEnv): boolean {
  if (env.NODE_ENV === "production") {
    return false;
  }
  return env.ENABLE_EXAMPLES === true;
}
