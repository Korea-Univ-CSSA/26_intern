import { create } from "zustand";

// file => SourceCode Zip File
// vexZipFile => vex zip File
const useUploadStore = create((set) => ({
  file: null,
  vexZipFile: null,
  hatbomFile: null,

  setFile: (file) => set({ file }),
  setVexZipFile: (vexZipFile) => set({ vexZipFile }),
  setHatbomFile: (hatbomFile) => set({ hatbomFile }),

  clearFile: () => {
    // console.log("🧹 clearFile 실행됨: source code");
    set({ file: null });
  },
  clearVexZipFile: () => {
    // console.log("🧹 clearFile 실행됨: vex");
    set({ vexZipFile: null });
  },
  clearHatbomFile: () => {
    // console.log("🧹 clearFile 실행됨: hatbomFile");
    set({ hatbomFile: null });
  },
}));

export default useUploadStore;
