import { create } from "zustand";

const useVexStore = create((set) => ({
  vexDoc: {
    "@context": "https://openvex.dev/ns/v0.2.0",
    "@id": "",
    timestamp: "",
    author: "IoTcube2.0",
    statements: [],
  },
  vexRequestCode: null,
  staticAnalysisResult: null,
  finishAnalysis: false,
  vexLock: false,

  setVexLock: (boolLock) => set({ vexLock: boolLock }),
  setFinishAnalysis: (bool) => set({ finishAnalysis: bool }),
  setStaticAnalysisResult: (result) => set({ staticAnalysisResult: result }),
  setVexDoc: (newCode) => set({ vexDoc: newCode }),
  setVexRequestCode: (newRequestCode) =>
    set({ vexRequestCode: newRequestCode }),
  clearVexRequestCode: () => set({ vexRequestCode: null }),
  clearStaticAnalysisResult: () => set({ staticAnalysisResult: null }),
}));
export default useVexStore;
