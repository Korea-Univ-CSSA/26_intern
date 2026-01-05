import { create } from "zustand";

// hatbom 관련된 store
const initialState = {
  projName: "Unknown",
  hidxFile: null,
  sbomFile: null,
  requestIdStore: "",
  tempFolderPath: "",
  cnepsState: "",
};

const useClientData = create((set) => ({
  ...initialState,

  setProjName: (name) => set({ projName: name }),
  setHidxFile: (file) => set({ hidxFile: file }),
  setSbomFile: (file) => set({ sbomFile: file }),
  setRequestIdStore: (id) => set({ requestIdStore: id }),
  setTempFolderPath: (path) => set({ tempFolderPath: path }),
  setCnepsState: (state) => set({ cnepsState: state }),

  reset: () => set(initialState),
}));

export default useClientData;
