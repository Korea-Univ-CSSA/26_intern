import { create } from "zustand";

const useStepStore = create((set) => ({
  step: 1,
  increase: () => set((state) => ({ step: state.step + 0 })),
  decrease: () => set((state) => ({ step: state.step - 0 })),
  setStep: (newStep) => set(() => ({ step: 1 })),
}));

export default useStepStore;
