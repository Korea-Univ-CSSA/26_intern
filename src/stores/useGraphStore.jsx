// cneps 의존성 그래프 전역 저장소
import { create } from "zustand";

const initialState = {
  graphData: { nodes: [], links: [] },
  isLoading: true,
  error: null,
};

const useGraphStore = create((set) => ({
  ...initialState,

  setGraphData: (data) => set({ graphData: data }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  // ✅ 초기화 메서드
  resetGraph: () => set(initialState),
}));

export default useGraphStore;
