export type LoaderContextType = {
  isGlobalLoading: boolean;
  isLocalLoading: boolean;
  setGlobalLoading: (x: boolean) => void;
  setLocalLoading: (x: boolean) => void;
};
