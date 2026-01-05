import { create } from "zustand";

export const useCdbStore = create((set) => ({
  data: [],
  ossAllCount: 0,
  loading: false,
  orderBy: "num",
  order: "asc",
  page: 1,
  pageGroup: 0,

  setData: (data) => set({ data }),
  appendData: (newData) =>
    set((state) => ({ data: [...state.data, ...newData] })),
  setOssAllCount: (count) => set({ ossAllCount: count }),
  setLoading: (loading) => set({ loading }),
  setOrder: (orderBy, order) => set({ orderBy, order }),
  setPage: (page) => set({ page, pageGroup: Math.floor((page - 1) / 5) }),
  reset: () => set({ data: [], ossAllCount: 0, page: 1, pageGroup: 0 }),
}));
