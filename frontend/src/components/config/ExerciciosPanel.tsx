"use client";

import { ExerciciosTableSkeleton } from "@/components/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/api";
import type { Exercicio, ExercicioFormData, Tecnica, Treino } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const emptyExercicio: ExercicioFormData = {
  treinoId: "",
  nome: "",
  series: "",
  tecnicaId: "",
  video: "",
  musculo: "",
  passoAPasso: "",
  dicas: "",
  observacoes: "",
};

type Props = {
  treinos: Treino[];
  tecnicas: Tecnica[];
  onRefresh: () => void;
};

export function ExerciciosPanel({ treinos, tecnicas, onRefresh }: Props) {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExercicioFormData>(emptyExercicio);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Exercicio[]>("exercicios");
      setExercicios(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar exercícios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditingId(null);
    setForm({ ...emptyExercicio, treinoId: treinos[0]?.id ?? "" });
    setModalOpen(true);
  }

  function openEdit(ex: Exercicio) {
    setEditingId(ex.id);
    setForm({
      treinoId: ex.treinoId,
      nome: ex.nome,
      series: ex.series,
      tecnicaId: ex.tecnicaId ?? "",
      video: ex.video ?? "",
      musculo: ex.musculo,
      passoAPasso: ex.passoAPasso ?? "",
      dicas: ex.dicas ?? "",
      observacoes: ex.observacoes ?? "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      const body = { ...form, tecnicaId: form.tecnicaId || null };
      if (editingId) {
        await adminFetch(`exercicios/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Exercício atualizado");
      } else {
        await adminFetch("exercicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Exercício criado");
      }
      setModalOpen(false);
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este exercício?")) return;
    try {
      await adminFetch(`exercicios/${id}`, { method: "DELETE" });
      toast.success("Exercício excluído");
      await load();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Exercícios</h2>
        <Button className="cursor-pointer" onClick={openNew} size="sm">
          <Plus className="h-4 w-4" />
          Novo Exercício
        </Button>
      </div>

      {loading ? (
        <ExerciciosTableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">Exercício</th>
                <th className="px-3 py-2 text-left">Grupo</th>
                <th className="px-3 py-2 text-center">Séries</th>
                <th className="px-3 py-2 text-left">Técnica</th>
                <th className="px-3 py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exercicios.map((ex) => (
                <tr key={ex.id} className="border-t">
                  <td className="px-3 py-2">{ex.nome}</td>
                  <td className="px-3 py-2 text-muted-foreground">{ex.treino?.nome ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{ex.series}</td>
                  <td className="px-3 py-2">{ex.tecnica?.nome ?? "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => openEdit(ex)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => handleDelete(ex.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Exercício" : "Novo Exercício"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Nome do exercício</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <Label>Grupo do treino</Label>
              <Select value={form.treinoId} onValueChange={(v) => setForm({ ...form, treinoId: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {treinos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Séries</Label>
                <Input value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} placeholder="4x" />
              </div>
              <div>
                <Label>Técnica</Label>
                <Select value={form.tecnicaId || "none"} onValueChange={(v) => setForm({ ...form, tecnicaId: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {tecnicas.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>URL do vídeo ou GIF</Label>
              <Input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Músculo principal</Label>
              <Input value={form.musculo} onChange={(e) => setForm({ ...form, musculo: e.target.value })} />
            </div>
            <div>
              <Label>Passo a passo</Label>
              <Textarea value={form.passoAPasso} onChange={(e) => setForm({ ...form, passoAPasso: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Dicas importantes</Label>
              <Textarea value={form.dicas} onChange={(e) => setForm({ ...form, dicas: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Observações (opcional)</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={2} />
            </div>
            <Button className="cursor-pointer" onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
