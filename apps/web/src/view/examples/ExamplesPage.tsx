import type {
  CreateExampleInput,
  UpdateExampleInput,
} from "@repo/shared-types";
import { Button } from "@repo/ui";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useCreateExample,
  useDeleteExample,
  useExamplesList,
  useUpdateExample,
} from "@/hooks/useExamples";
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

const formatToast = (error: unknown): string => {
  if (isApiError(error) || error instanceof Error) {
    return ErrorHandler.formatToastMessage(error);
  }
  return "알 수 없는 오류 (req: -)";
};

const ExamplesPage = () => {
  const list = useExamplesList();
  const createMutation = useCreateExample();
  const updateMutation = useUpdateExample();
  const deleteMutation = useDeleteExample();

  const [toast, setToast] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExampleFormState>(EMPTY_EXAMPLE_FORM);

  const items = useMemo(() => list.data?.items ?? [], [list.data]);
  const submitting = createMutation.isLoading || updateMutation.isLoading;

  useEffect(() => {
    const error =
      list.error ??
      createMutation.error ??
      updateMutation.error ??
      deleteMutation.error;
    if (!error) {
      return;
    }
    setToast(formatToast(error));
  }, [
    list.error,
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
  ]);

  const openCreateDialog = useCallback(() => {
    setDialogMode("create");
    setEditingId(null);
    setForm(EMPTY_EXAMPLE_FORM);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setDialogMode("create");
    setEditingId(null);
    setForm(EMPTY_EXAMPLE_FORM);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) {
      return;
    }
    try {
      if (dialogMode === "edit" && editingId) {
        const update: UpdateExampleInput = {
          title: form.title,
          description: form.description || null,
          status: form.status,
        };
        await updateMutation.mutate({ id: editingId, input: update });
      } else {
        const payload: CreateExampleInput = {
          title: form.title,
          description: form.description || undefined,
          status: form.status,
        };
        await createMutation.mutate(payload);
      }
      closeDialog();
      await list.refetch();
    } catch {
      // toast useEffect가 mutation.error를 watching해 표시한다.
    }
  }, [
    submitting,
    dialogMode,
    editingId,
    form,
    updateMutation,
    createMutation,
    closeDialog,
    list,
  ]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutate(id);
        await list.refetch();
      } catch {
        // toast useEffect가 deleteMutation.error를 watching해 표시한다.
      }
    },
    [deleteMutation, list],
  );

  const handleEdit = useCallback(
    (id: string) => {
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
    },
    [items],
  );

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
        aria-busy={list.loading}
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
