import type { ExampleListItem as ExampleListItemType } from "@repo/shared-types";
import { Button, cn, Empty, SystemIcon } from "@repo/ui";

import ExampleListItem from "./ExampleListItem";
import { type ExamplesListView, PAGE_ACTION_CLASS } from "./examplesView";

const TABLE_HEADS = ["Title", "Status", "Created", "Actions"] as const;

const TITLE_BAR_CLASSES = ["w-3/5", "w-12/25", "w-14/25"] as const;

const BAR_CLASS = "block h-4 rounded-sm bg-muted motion-safe:animate-pulse";

const PlaceholderRow = ({ titleBarClass }: { titleBarClass: string }) => (
  <tr className="border-border tablet:h-14 h-17 border-b last:border-b-0">
    <td className="p-3 align-middle">
      <span className={cn(BAR_CLASS, titleBarClass)} />
    </td>
    <td className="p-3 align-middle">
      <span className={cn(BAR_CLASS, "w-20")} />
    </td>
    <td className="p-3 align-middle">
      <span className={cn(BAR_CLASS, "w-24")} />
    </td>
    <td className="p-3 align-middle">
      <span className="bg-muted tablet:h-8 tablet:w-28 block h-11 w-48 rounded-sm motion-safe:animate-pulse" />
    </td>
  </tr>
);

interface ExamplesTableProps {
  view: Exclude<ExamplesListView, "empty">;
  items: ExampleListItemType[];
  busy: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

const ExamplesTable = ({
  view,
  items,
  busy,
  onEdit,
  onDelete,
  onRetry,
}: ExamplesTableProps) => (
  <div
    className="border-border bg-card overflow-x-auto rounded-lg border"
    aria-busy={view === "loading" || busy}
  >
    <table className="tablet:min-w-0 w-full min-w-150 text-left text-sm">
      <thead>
        <tr>
          {TABLE_HEADS.map((head) => (
            <th
              key={head}
              scope="col"
              className="border-border tracking-label text-muted-foreground border-b p-3 font-mono text-xs font-bold whitespace-nowrap uppercase"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      {view === "error" ? null : (
        <tbody>
          {view === "loading"
            ? TITLE_BAR_CLASSES.map((titleBar) => (
                <PlaceholderRow key={titleBar} titleBarClass={titleBar} />
              ))
            : items.map((item) => (
                <ExampleListItem
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
        </tbody>
      )}
    </table>
    {view === "error" ? (
      <Empty
        role="alert"
        className="tablet:items-center items-stretch px-6"
        icon={
          <SystemIcon
            name="octagon-x"
            size={24}
            className="text-destructive"
            aria-hidden
          />
        }
        title="예제 목록을 불러오지 못했습니다."
        description="잠시 후 다시 시도해 주세요. 개발 환경에서는 api 앱(포트 4000)이 실행 중인지 확인해 보세요."
        action={
          <Button
            type="button"
            size="lg"
            variant="outline"
            className={PAGE_ACTION_CLASS}
            onClick={onRetry}
          >
            다시 시도
          </Button>
        }
      />
    ) : null}
  </div>
);

export default ExamplesTable;
