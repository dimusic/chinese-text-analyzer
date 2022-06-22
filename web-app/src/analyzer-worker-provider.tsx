import { createContext, ReactNode, useContext } from "react";

const AnalyzerWorkerContext = createContext<Worker | null>(null);

export function AnalyzerWorkerProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const worker = new Worker(new URL('./analyzer-worker.js', import.meta.url), {
    type: 'module',
  });
  
  return (
    <AnalyzerWorkerContext.Provider value={worker}>{ children }</AnalyzerWorkerContext.Provider>
  );
}

export function useAnalyzerWorker(): Worker {
  const worker = useContext(AnalyzerWorkerContext);
  return worker!;
}