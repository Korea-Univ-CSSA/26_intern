import { create } from "zustand";

const useVulStore = create((set) => ({
  response: null,
  vomResponse: null,
  vexReturn: {
    "@context": "https://openvex.dev/ns/v0.2.0",
    "@id": "",
    timestamp: "",
    author: "IoTcube2.0",
    statements: [],
  },
  vuddyHidx: null,

  setResponse: (response) =>
    set((state) => ({
      ...state,
      response,
    })),

  setVomResponse: (vomResponse) =>
    set((state) => ({
      ...state,
      vomResponse,
    })),

  setVexReturn: (vexReturn) =>
    set((state) => ({
      ...state,
      vexReturn,
    })),

  setVuddyHidx: (vuddyHidx) =>
    set((state) => ({
      ...state,
      vuddyHidx,
    })),
}));

export default useVulStore;
