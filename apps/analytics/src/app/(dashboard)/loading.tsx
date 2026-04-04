export default function DashboardLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* Page title + subtitle */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-72 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-96 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        {/* Filter bar */}
        <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {/* Sentinel / status banner */}
      <div className="h-16 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />

      {/* KPI metric cards — 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800"
          />
        ))}
      </div>

      {/* Primary chart panel */}
      <div className="bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="h-3 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-[450px] rounded-2xl bg-zinc-200 dark:bg-zinc-700/50" />
      </div>

      {/* Secondary chart panel */}
      <div className="bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-[360px] rounded-2xl bg-zinc-200 dark:bg-zinc-700/50" />
      </div>
    </div>
  );
}
