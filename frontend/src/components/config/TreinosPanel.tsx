"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/api";
import type { Treino, TreinoFormData } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const emptyTreino: TreinoFormData = { nome: "", ordem: 0 };

type Props = {
  onRefresh: () => void;
};

export function TreinosPanel({ onRefresh }: Props) {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TreinoFormData>(emptyTreino);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Treino[]>("treinos");
      setTreinos(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar treinos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditingId(null);
    setForm({ nome: "", ordem: treinos.length });
    setModalOpen(true);
  }

  function openEdit(t: Treino) {
    setEditingId(t.id);
    setForm({ nome: t.nome, ordem: t.ordem });
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      if (editingId) {
        await adminFetch(`treinos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Grupo atualizado");
      } else {
        await adminFetch("treinos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Grupo criado");
      }
      setModalOpen(false);
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este grupo? Todos os exercícios serão removidos.")) return;
    try {
      await adminFetch(`treinos/${id}`, { method: "DELETE" });
      toast.success("Grupo excluído");
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Grupos de treino</h2>
        <Button className="cursor-pointer" onClick={openNew} size="sm">
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {treinos.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="font-medium">{t.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {t.exercicios?.length ?? 0} exercício(s) · ordem {t.ordem}
                </p>
              </div>
              <div className="flex gap-1">
                <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => openEdit(t)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Grupo" : "Novo Grupo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Nome (ex: A - Peito e ABS)</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={form.ordem}
                onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })}
              />
            </div>
            <Button className="cursor-pointer" onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
