import { create } from "zustand";

// 초기 상태 정의
const initialState = {
  details: null,
  status: null,
  treeData: null,
  treeContainerRefStore: null,
};

const useZipFileStore = create((set) => ({
  ...initialState,

  setDetails: (details) => set({ details }),
  setStatus: (status) => set({ status }),
  setTreeData: (treeData) => set({ treeData }),
  setTreeContainerRefStore: (ref) => set({ treeContainerRefStore: ref }),

  resetZipFileStore: () => set(initialState),
}));

export default useZipFileStore;
