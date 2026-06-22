// Lightweight build profiler — measures wall-clock time of named phases and
// prints a sorted summary to the console so the slowest steps are obvious.
// Toggle off by setting ENABLED to false.
const ENABLED = true

export class Profiler {
  private label: string
  private entries: { name: string; ms: number }[] = []
  private start: number

  constructor(label: string) {
    this.label = label
    this.start = performance.now()
  }

  // Measure a synchronous function and record its duration.
  measure<T>(name: string, fn: () => T): T {
    if (!ENABLED) return fn()
    const t0 = performance.now()
    const result = fn()
    this.entries.push({ name, ms: performance.now() - t0 })
    return result
  }

  // Record an externally-timed phase.
  add(name: string, ms: number) {
    if (!ENABLED) return
    this.entries.push({ name, ms })
  }

  // Print a sorted summary (slowest first) plus the total.
  flush() {
    if (!ENABLED || this.entries.length === 0) return
    const total = performance.now() - this.start
    const sorted = [...this.entries].sort((a, b) => b.ms - a.ms)

    console.groupCollapsed(
      `%c[${this.label}] total ${total.toFixed(1)}ms`,
      'color:#0ea5e9;font-weight:bold',
    )
    console.table(
      sorted.map((e) => ({
        phase: e.name,
        ms: +e.ms.toFixed(2),
        '%': +((e.ms / total) * 100).toFixed(1),
      })),
    )
    const slowest = sorted[0]
    console.log(
      `%cslowest: ${slowest.name} (${slowest.ms.toFixed(1)}ms, ${((slowest.ms / total) * 100).toFixed(0)}%)`,
      'color:#f59e0b',
    )
    console.groupEnd()
  }
}
