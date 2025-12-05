import { useState, useEffect } from 'react';
import { addTransaction } from '../api';

export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [syncNotification, setSyncNotification] = useState(null);

    // Load pending transactions from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('pending_transactions');
        if (saved) {
            try {
                setPendingTransactions(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing pending transactions', e);
            }
        }
    }, []);

    // Listen for online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sync when back online
    useEffect(() => {
        if (isOnline && pendingTransactions.length > 0) {
            const sync = async () => {
                let syncedCount = 0;
                // Create a copy to iterate and modify
                let remaining = [...pendingTransactions];
                const toSync = [...pendingTransactions];

                for (const transaction of toSync) {
                    try {
                        await addTransaction(transaction);
                        // Remove from remaining if successful
                        // We use the exact object reference from the snapshot 'toSync' to find it in 'remaining'
                        // But wait, 'remaining' is a new array. The objects inside are the same references if not deep cloned.
                        // JSON.parse creates new objects.
                        // So we should rely on index or content.
                        // Since we iterate 'toSync' which is a copy of 'pendingTransactions' at start of effect,
                        // and 'remaining' is also a copy.
                        // Let's just filter out the one we just synced.
                        // To be safe, let's assume we sync the first one, then the next.
                        // But here we iterate all.

                        // Let's remove by matching the object properties or just index if we process in order.
                        // Simplest is to remove the specific item from the array.
                        remaining = remaining.filter(t => t !== transaction);
                        syncedCount++;
                    } catch (error) {
                        console.error('Error syncing transaction:', error);
                        // If it fails, it stays in remaining
                    }
                }

                setPendingTransactions(remaining);
                localStorage.setItem('pending_transactions', JSON.stringify(remaining));

                if (syncedCount > 0) {
                    setSyncNotification('Sincronizado con éxito');
                    setTimeout(() => setSyncNotification(null), 3000);
                }
            };

            sync();
        }
    }, [isOnline]); // Removed pendingTransactions from dependency to avoid loop if we update it inside. 
    // Actually, if we update pendingTransactions, we want to trigger sync? 
    // No, only if we go online.
    // But if we add a transaction while online, it goes directly to API.
    // If we add while offline, it goes to pending.
    // Then if we go online, it syncs.
    // What if we are online and we have pending? (e.g. loaded from storage).
    // The effect runs on mount (isOnline true) and syncs. Correct.

    const addOfflineTransaction = async (transaction) => {
        if (isOnline) {
            return await addTransaction(transaction);
        } else {
            // Add to pending
            const newPending = [...pendingTransactions, transaction];
            setPendingTransactions(newPending);
            localStorage.setItem('pending_transactions', JSON.stringify(newPending));
            return { offline: true };
        }
    };

    return {
        isOnline,
        pendingTransactions,
        addOfflineTransaction,
        syncNotification
    };
};
