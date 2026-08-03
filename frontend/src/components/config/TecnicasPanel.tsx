"use client";

import { TecnicasPanelSkeleton } from "@/components/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/api";
import type { Tecnica, TecnicaFormData } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const emptyTecnica: TecnicaFormData = {
  nome: "",
  descricao: "",
  comoExecutar: "",
  beneficios: "",
  quandoUtilizar: "",
  observacoes: "",
};

type Props = {
  onRefresh: () => void;
};

export function TecnicasPanel({ onRefresh }: Props) {
  const [tecnicas, setTecnicas] = useState<Tecnica[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TecnicaFormData>(emptyTecnica);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Tecnica[]>("tecnicas");
      setTecnicas(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar técnicas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditingId(null);
    setForm(emptyTecnica);
    setModalOpen(true);
  }

  function openEdit(t: Tecnica) {
    setEditingId(t.id);
    setForm({
      nome: t.nome,
      descricao: t.descricao,
      comoExecutar: t.comoExecutar,
      beneficios: t.beneficios,
      quandoUtilizar: t.quandoUtilizar ?? "",
      observacoes: t.observacoes ?? "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      if (editingId) {
        await adminFetch(`tecnicas/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Técnica atualizada");
      } else {
        await adminFetch("tecnicas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Técnica criada");
      }
      setModalOpen(false);
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta técnica?")) return;
    try {
      await adminFetch(`tecnicas/${id}`, { method: "DELETE" });
      toast.success("Técnica excluída");
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Técnicas de treino</h2>
        <Button className="cursor-pointer" onClick={openNew} size="sm">
          <Plus className="h-4 w-4" />
          Nova Técnica
        </Button>
      </div>

      {loading ? (
        <TecnicasPanelSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tecnicas.map((t) => (
            <div key={t.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-primary">{t.nome}</h3>
                <div className="flex gap-1">
                  <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => openEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{t.descricao}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Técnica" : "Nova Técnica"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Como executar</Label>
              <Textarea
                value={form.comoExecutar}
                onChange={(e) => setForm({ ...form, comoExecutar: e.target.value })}
                rows={4}
                placeholder="• Série 1: 12 repetições&#10;• Série 2: 10 repetições"
              />
            </div>
            <div>
              <Label>Benefícios</Label>
              <Textarea value={form.beneficios} onChange={(e) => setForm({ ...form, beneficios: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Quando utilizar</Label>
              <Textarea value={form.quandoUtilizar} onChange={(e) => setForm({ ...form, quandoUtilizar: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={2} />
            </div>
            <Button className="cursor-pointer" onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
