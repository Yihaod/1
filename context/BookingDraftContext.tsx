import React, { createContext, useContext, useMemo, useState } from 'react';
import { BookingDraft, emptyDraft } from '@/types/booking';

type BookingDraftContextValue = {
  draft: BookingDraft;
  setDraft: React.Dispatch<React.SetStateAction<BookingDraft>>;
  resetDraft: () => void;
  loadFromBooking: (input: Partial<BookingDraft>) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      editingId,
      setEditingId,
      resetDraft: () => {
        setDraft(emptyDraft());
        setEditingId(null);
      },
      loadFromBooking: (input: Partial<BookingDraft>) => {
        setDraft((prev) => ({ ...prev, ...input }));
      },
    }),
    [draft, editingId]
  );

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error('useBookingDraft must be used within BookingDraftProvider');
  return ctx;
}
