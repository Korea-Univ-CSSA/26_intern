import { create } from "zustand";

const useFileStore = create((set) => ({
  selectedFiles: [],
  selectedVomFiles: [],

  addFile: (file) =>
    set((state) =>
      state.selectedFiles.some(
        (item) =>
          item.file === file.file &&
          item.cve === file.cve &&
          item.funcid === file.funcid
      )
        ? state
        : { selectedFiles: [...state.selectedFiles, file] }
    ),
  removeFile: (file) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter(
        (item) =>
          !(
            item.file === file.file &&
            item.cve === file.cve &&
            item.funcid === file.funcid
          )
      ),
    })),

  vomAddFile: (file) =>
    set((state) =>
      state.selectedVomFiles.some((item) => item.cve === file.cve)
        ? state
        : { selectedVomFiles: [...state.selectedVomFiles, file] }
    ),
  VomRemoveFile: (file) =>
    set((state) => ({
      selectedVomFiles: state.selectedVomFiles.filter(
        (item) => !(item.cve === file.cve)
      ),
    })),
}));

export default useFileStore;
