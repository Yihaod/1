import { clinicStores } from '@/data/stores';
import React, { createContext, useContext, useMemo, useState } from 'react';

type AdminStoreContextValue = {
  storeId: string;
  storeName: string;
  setStoreId: (id: string) => void;
};

const AdminStoreContext = createContext<AdminStoreContextValue | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [storeId, setStoreId] = useState(clinicStores[0]?.id ?? '');

  const value = useMemo(() => {
    const store = clinicStores.find((s) => s.id === storeId);
    return {
      storeId,
      storeName: store?.name ?? '未选择门店',
      setStoreId,
    };
  }, [storeId]);

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used within AdminStoreProvider');
  return ctx;
}
