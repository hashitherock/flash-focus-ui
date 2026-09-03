import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CAMPAIGNS, type Campaign, type Status } from "@/lib/flash-data";

type PendingChange = { campaignId: string; from: Status; to: Status; name: string };
type ToastState = { id: number; name: string; from: Status; to: Status };

type Ctx = {
  campaigns: Campaign[];
  pending: PendingChange | null;
  toast: ToastState | null;
  changedId: string | null;
  requestStatusChange: (c: Campaign, to: Status) => void;
  cancelStatusChange: () => void;
  confirmStatusChange: () => void;
  dismissToast: () => void;
  addCampaign: (c: Campaign) => void;
};

const FlashContext = createContext<Ctx | null>(null);

export function FlashProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [changedId, setChangedId] = useState<string | null>(null);

  const requestStatusChange = useCallback((c: Campaign, to: Status) => {
    if (c.status === to) return;
    setPending({ campaignId: c.id, from: c.status, to, name: c.name });
  }, []);

  const cancelStatusChange = useCallback(() => setPending(null), []);

  const confirmStatusChange = useCallback(() => {
    setPending((p) => {
      if (!p) return null;
      setCampaigns((list) =>
        list.map((c) => (c.id === p.campaignId ? { ...c, status: p.to } : c)),
      );
      setChangedId(p.campaignId);
      const id = Date.now();
      setToast({ id, name: p.name, from: p.from, to: p.to });
      setTimeout(() => setChangedId((cur) => (cur === p.campaignId ? null : cur)), 1800);
      setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 4200);
      return null;
    });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addCampaign = useCallback((c: Campaign) => {
    setCampaigns((list) => [c, ...list]);
  }, []);

  const value = useMemo(
    () => ({
      campaigns,
      pending,
      toast,
      changedId,
      requestStatusChange,
      cancelStatusChange,
      confirmStatusChange,
      dismissToast,
      addCampaign,
    }),
    [
      campaigns,
      pending,
      toast,
      changedId,
      requestStatusChange,
      cancelStatusChange,
      confirmStatusChange,
      dismissToast,
      addCampaign,
    ],
  );

  return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlash must be used inside FlashProvider");
  return ctx;
}
