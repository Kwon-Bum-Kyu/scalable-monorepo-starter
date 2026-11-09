import type {
  CreateExampleInput,
  UpdateExampleInput,
} from "@repo/shared-types";
import { Badge, Button, Card, Empty, SystemIcon, toast } from "@repo/ui";
import { useCallback, useMemo, useRef, useState } from "react";

import PageContainer from "@/components/layouts/PageContainer";
import {
  useCreateExample,
  useDeleteExample,
  useExamplesList,
  useUpdateExample,
} from "@/hooks/useExamples";
import { fetchExampleDetail } from "@/services/examples";
import type { ApiError } from "@/types/api";
import { ErrorHandler } from "@/utils/errorHandler";

import DeleteExampleDialog, {
  type DeleteExampleTarget,
} from "./DeleteExampleDialog";
import ExampleFormDialog from "./ExampleFormDialog";
import { EMPTY_EXAMPLE_FORM, type ExampleFormState } from "./exampleFormState";
import ExamplesTable from "./ExamplesTable";
import { PAGE_ACTION_CLASS, resolveListView } from "./examplesView";

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
  return "알 수 없는 오류";
};

const ExamplesPage = () => {
  const list = useExamplesList();
  const createMutation = useCreateExample();
  const updateMutation = useUpdateExample();
  const deleteMutation = useDeleteExample();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExampleFormState>(EMPTY_EXAMPLE_FORM);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editReady, setEditReady] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DeleteExampleTarget | null>(
    null,
  );
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const editRequestRef = useRef<string | null>(null);

  const items = useMemo(() => list.data?.items ?? [], [list.data]);
  const submitting = createMutation.isLoading || updateMutation.isLoading;

  // Radix Dialog는 DialogTrigger 없이 열면 포커스를 되돌리지 않아 직접 저장한다.
  const rememberFocus = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  }, []);

  const openCreateDialog = useCallback(() => {
    rememberFocus();
    setDialogMode("create");
    setEditingId(null);
    setForm(EMPTY_EXAMPLE_FORM);
    setDetailLoading(false);
    setEditReady(true);
    setDialogOpen(true);
  }, [rememberFocus]);

  const closeDialog = useCallback(() => {
    editRequestRef.current = null;
    setDetailLoading(false);
    setDialogOpen(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting || !editReady) {
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
    } catch (error) {
      toast.error(formatToast(error));
      return;
    }
    void list.refetch().catch(() => {});
  }, [
    submitting,
    editReady,
    dialogMode,
    editingId,
    form,
    updateMutation,
    createMutation,
    closeDialog,
    list,
  ]);

  const requestDelete = useCallback(
    (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      rememberFocus();
      setDeleteTarget({ id, title: target.title });
    },
    [items, rememberFocus],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeleteTarget(null);
      try {
        await deleteMutation.mutate(id);
        // 삭제된 행 버튼은 사라지므로 다이얼로그 닫힘 포커스 복귀 대상을 h1로 바꾼다.
        returnFocusRef.current = headingRef.current;
        headingRef.current?.focus();
      } catch (error) {
        toast.error(formatToast(error));
        return;
      }
      void list.refetch().catch(() => {});
    },
    [deleteMutation, list],
  );

  const handleEdit = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      rememberFocus();
      setDialogMode("edit");
      setEditingId(id);
      setForm({
        title: target.title,
        description: "",
        status: target.status,
      });
      setDetailLoading(true);
      setEditReady(false);
      setDialogOpen(true);
      editRequestRef.current = id;

      try {
        const detail = await fetchExampleDetail(id);
        if (editRequestRef.current !== id) {
          return;
        }
        setForm({
          title: detail.title,
          description: detail.description ?? "",
          status: detail.status,
        });
        setEditReady(true);
      } catch (error) {
        if (editRequestRef.current === id) {
          toast.error(formatToast(error));
        }
      } finally {
        if (editRequestRef.current === id) {
          setDetailLoading(false);
        }
      }
    },
    [items, rememberFocus],
  );

  const view = resolveListView(list);
  const retry = () => {
    void list.refetch().catch(() => {
      /* useApi가 error 상태로 노출한다 */
    });
  };

  return (
    <PageContainer className="tablet:pt-12 tablet:pb-16 pt-8 pb-12">
      <header className="tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-6 mb-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="tablet:text-3xl text-2xl font-bold focus:outline-none"
            >
              Examples
            </h1>
            <Badge variant="warn">개발 모드 전용</Badge>
          </div>
          <p className="text-muted-foreground text-base">
            {view === "loading"
              ? "예제 목록을 불러오는 중입니다."
              : "개발 환경에서만 열리는 CRUD 예제입니다. 배포 환경(production, staging)에서는 API가 이 기능을 마운트하지 않습니다."}
          </p>
        </div>
        {view === "empty" ? null : (
          <Button
            type="button"
            size="lg"
            className={PAGE_ACTION_CLASS}
            onClick={openCreateDialog}
          >
            + New Example
          </Button>
        )}
      </header>

      {view === "empty" ? (
        <Card variant="flat">
          <Empty
            className="tablet:items-center items-stretch px-6"
            icon={<SystemIcon name="info" size={24} aria-hidden />}
            title="아직 예제가 없습니다."
            description="첫 예제를 만들면 이 목록에 표시됩니다."
            action={
              <Button
                type="button"
                size="lg"
                className={PAGE_ACTION_CLASS}
                onClick={openCreateDialog}
              >
                첫 예제 만들기
              </Button>
            }
          />
        </Card>
      ) : (
        <ExamplesTable
          view={view}
          items={items}
          busy={list.loading}
          onEdit={handleEdit}
          onDelete={requestDelete}
          onRetry={retry}
        />
      )}

      <ExampleFormDialog
        open={dialogOpen}
        mode={dialogMode}
        value={form}
        disabled={!editReady}
        loading={detailLoading}
        onChange={setForm}
        onSubmit={handleSubmit}
        onClose={closeDialog}
        returnFocusRef={returnFocusRef}
      />
      <DeleteExampleDialog
        target={deleteTarget}
        onConfirm={(id) => void handleDelete(id)}
        onCancel={() => setDeleteTarget(null)}
        returnFocusRef={returnFocusRef}
      />
    </PageContainer>
  );
};

export default ExamplesPage;
