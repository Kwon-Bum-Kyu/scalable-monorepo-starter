import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { readManifest } from "../../src/setup/manifest.mjs";

type Manifest = ReturnType<typeof readManifest>;

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const tempDirectories: string[] = [];

function write(root: string, relativePath: string, content = ""): void {
  const target = path.join(root, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function app(
  id: string,
  options: { note?: string; packages?: string[] } = {},
): Manifest["apps"][number] {
  return {
    id,
    label: id,
    hint: `${id} app`,
    dir: `apps/${id}`,
    default: id === "web",
    requires: [],
    packages: options.packages ?? ["base"],
    rootScripts: [`dev:${id}`],
    paths: [],
    dev: {
      script: `dev:${id}`,
      url: options.note ? null : `http://localhost:${id === "web" ? 3000 : 4000}`,
      note: options.note ?? null,
      prerequisite: null,
    },
  };
}

export function createFakeTemplate(options: { mobile?: boolean } = {}): {
  root: string;
  parent: string;
} {
  const parent = mkdtempSync(path.join(tmpdir(), "setup-run-"));
  tempDirectories.push(parent);
  const root = path.join(parent, "template");
  mkdirSync(root);

  const apps = [app("api"), app("web"), app("desktop", { note: "창" })];
  if (options.mobile) {
    apps.push(app("mobile", { note: "기기" }));
  }
  const manifest: Manifest = {
    apps,
    packages: [
      { id: "base", dir: "packages/base", always: true, paths: [] },
    ],
    conditionalPaths: [],
    templateOnly: ["packages/create-scalable-monorepo-starter"],
    markerFiles: [".env.example"],
    rename: {
      from: "starter-name",
      displayFrom: "Starter Name",
      npmNameFiles: [],
      displayNameFiles: [],
      replacements: [],
    },
  };

  for (const item of apps) {
    write(root, `${item.dir}/keep.txt`, item.id);
  }
  mkdirSync(path.join(root, "packages/base"), { recursive: true });
  const scripts = Object.fromEntries([
    [
      "setup",
      "node packages/create-scalable-monorepo-starter/src/setup/run.mjs",
    ],
    ...apps.map((item) => [`dev:${item.id}`, item.id]),
  ]);
  write(
    root,
    "package.json",
    `${JSON.stringify({ name: "starter-name", version: "1.1.0", scripts }, null, 2)}\n`,
  );
  write(
    root,
    "package-lock.json",
    `${JSON.stringify(
      {
        name: "starter-name",
        packages: Object.fromEntries([
          ["", { name: "starter-name", version: "1.1.0" }],
          ...apps.flatMap((item) => [
            [item.dir, {}],
            [`node_modules/${item.id}`, { link: true, resolved: item.dir }],
          ]),
          ["packages/base", {}],
          ["packages/create-scalable-monorepo-starter", {}],
          [
            "node_modules/create-scalable-monorepo-starter",
            {
              link: true,
              resolved: "packages/create-scalable-monorepo-starter",
            },
          ],
        ]),
      },
      null,
      2,
    )}\n`,
  );
  write(
    root,
    "turbo.json",
    `${JSON.stringify({ globalDependencies: [".env"] }, null, 2)}\n`,
  );
  write(
    root,
    ".env.example",
    "# >>> APP:api\nDATABASE_URL=postgres://example\n# <<< APP:api\nVITE_API_BASE_URL=http://localhost:4000\n",
  );
  write(root, "README.md", "old readme\n");
  write(root, "example.txt", "example\n");
  write(
    root,
    "scripts/remove-examples.mjs",
    'import { rmSync } from "node:fs";\nrmSync(new URL("../example.txt", import.meta.url), { force: true });\nprocess.stdout.write("examples 제거 결과: 완료\\n");\n',
  );

  const cliRoot = path.join(root, "packages/create-scalable-monorepo-starter");
  cpSync(path.join(PACKAGE_ROOT, "src/setup"), path.join(cliRoot, "src/setup"), {
    recursive: true,
  });
  write(
    root,
    "packages/create-scalable-monorepo-starter/starter.manifest.json",
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  write(
    root,
    "packages/create-scalable-monorepo-starter/src/setup/readme.template.md",
    "# {{displayName}}\n\n{{npmName}}\n\n{{appLines}}\n",
  );

  return { root, parent };
}

export function cleanupFakeTemplates(): void {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
}
