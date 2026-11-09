import type { ExampleListItem as ExampleListItemType } from "@repo/shared-types";
import { Badge, Button } from "@repo/ui";

import { ROW_ACTION_CLASS } from "./examplesView";

interface ExampleListItemProps {
  item: ExampleListItemType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExampleListItem = ({ item, onEdit, onDelete }: ExampleListItemProps) => {
  return (
    <tr className="border-border tablet:h-14 h-17 border-b last:border-b-0">
      <td className="text-foreground p-3 align-middle">{item.title}</td>
      <td className="p-3 align-middle">
        <Badge>{item.status}</Badge>
      </td>
      <td className="text-muted-foreground p-3 align-middle font-mono">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="p-3 align-middle">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={ROW_ACTION_CLASS}
            onClick={() => onEdit(item.id)}
            aria-label={`Edit ${item.title}`}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={ROW_ACTION_CLASS}
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.title}`}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ExampleListItem;
