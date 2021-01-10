export interface Logger {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
}