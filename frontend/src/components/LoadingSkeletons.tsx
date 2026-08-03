import { Skeleton } from "@/components/ui/skeleton";

export function TreinoTableSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Carregando treinos">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-56 sm:w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-4/5 max-w-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-3 w-40" />
      <span className="sr-only">Carregando treinos...</span>
    </div>
  );
}

export function ExerciciosTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border" role="status" aria-label="Carregando exercícios">
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
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-t">
              <td className="px-3 py-3"><Skeleton className="h-4 w-36" /></td>
              <td className="px-3 py-3"><Skeleton className="h-4 w-28" /></td>
              <td className="px-3 py-3"><Skeleton className="mx-auto h-4 w-10" /></td>
              <td className="px-3 py-3"><Skeleton className="h-4 w-24" /></td>
              <td className="px-3 py-3"><Skeleton className="ml-auto h-8 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className="sr-only">Carregando exercícios...</span>
    </div>
  );
}

export function TecnicasPanelSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="status" aria-label="Carregando técnicas">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando técnicas...</span>
    </div>
  );
}

export function TreinosPanelSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Carregando grupos">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
      <span className="sr-only">Carregando grupos...</span>
    </div>
  );
}
