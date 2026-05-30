import type { ExampleListItem as ExampleListItemType } from "@repo/shared-types";
import { Button } from "@repo/ui";

interface ExampleListItemProps {
  item: ExampleListItemType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExampleListItem = ({ item, onEdit, onDelete }: ExampleListItemProps) => {
  return (
    <tr className="border-b">
      <td className="p-3 text-foreground">{item.title}</td>
      <td className="p-3 text-muted-foreground">{item.status}</td>
      <td className="p-3 text-muted-foreground">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(item.id)}
            aria-label={`Edit ${item.title}`}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
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
