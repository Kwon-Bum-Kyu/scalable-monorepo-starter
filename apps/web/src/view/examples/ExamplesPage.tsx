import type {
  CreateExampleInput,
  ExampleListItem as ExampleListItemType,
  UpdateExampleInput,
} from "@repo/shared-types";
import { Button } from "@repo/ui";
import { useCallback, useEffect, useState } from "react";

import {
  createExample,
  deleteExample,
  fetchExamplesList,
  updateExample,
} from "@/services/examples";
import type { ApiError } from "@/types/api";
import { ErrorHandler } from "@/utils/errorHandler";

import ExampleFormDialog from "./ExampleFormDialog";
import {
  EMPTY_EXAMPLE_FORM,
  type ExampleFormState,
} from "./exampleFormState";
import ExampleListItem from "./ExampleListItem";

type DialogMode = "create" | "edit";

const isApiError = (error: unknown): error is ApiError => {
  return Boolean(
    error && typeof error === "object" && "code" in (error as object),
  );
};

const ExamplesPage = () => {
  const [items, setItems] = useState<ExampleListItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ExampleFormState>(EMPTY_EXAMPLE_FORM);

  const showError = useCallback((error: unknown) => {
    if (isApiError(error) || error instanceof Error) {
      setToast(ErrorHandler.formatToastMessage(error));
      return;
    }
    setToast("알 수 없는 오류 (req: -)");
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchExamplesList();
      setItems(response.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const openCreateDialog = () => {
    setDialogMode("create");
    setEditingId(null);
    setForm(EMPTY_EXAMPLE_FORM);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogMode("create");
    setEditingId(null);
    setForm(EMPTY_EXAMPLE_FORM);
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      if (dialogMode === "edit" && editingId) {
        const update: UpdateExampleInput = {
          title: form.title,
          description: form.description || null,
          status: form.status,
        };
        await updateExample(editingId, update);
      } else {
        const payload: CreateExampleInput = {
          title: form.title,
          description: form.description || undefined,
          status: form.status,
        };
        await createExample(payload);
      }
      closeDialog();
      await loadList();
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExample(id);
      await loadList();
    } catch (error) {
      showError(error);
    }
  };

  const handleEdit = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) {
      return;
    }
    setDialogMode("edit");
    setEditingId(id);
    setForm({
      title: target.title,
      description: "",
      status: target.status,
    });
    setDialogOpen(true);
  };

  return (
    <main className="container mx-auto p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">Examples</h1>
        <Button type="button" onClick={openCreateDialog}>
          + New Example
        </Button>
      </header>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-destructive text-destructive-foreground mb-4 rounded-md p-3"
        >
          {toast}
        </div>
      ) : null}

      <section
        aria-busy={loading}
        className="bg-card text-card-foreground rounded-md border"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="text-muted-foreground p-3">Title</th>
              <th className="text-muted-foreground p-3">Status</th>
              <th className="text-muted-foreground p-3">Created</th>
              <th className="text-muted-foreground p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ExampleListItem
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </section>

      <ExampleFormDialog
        open={dialogOpen}
        mode={dialogMode}
        value={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        onClose={closeDialog}
      />
    </main>
  );
};

export default ExamplesPage;
