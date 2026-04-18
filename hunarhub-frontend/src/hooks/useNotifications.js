import { useEffect, useState } from "react";
import API from "../api/axios";

export function useNotifications(user) {
  const [hasNewIncoming, setHasNewIncoming] = useState(false);
  const [hasNewMyRequests, setHasNewMyRequests] = useState(false);

  useEffect(() => {
    if (!user) return;

    let interval;

    const checkNotifications = async () => {
      try {
        // 🔴 INCOMING (SELLER)
        const res = await API.get("/requests/incoming");
        const incoming = res.data.requests;

        const lastSeen =
          Number(localStorage.getItem("lastSeenIncoming")) || 0;

        if (incoming.length > lastSeen) {
          setHasNewIncoming(true);
        }

      } catch (err) {
        if (err.response?.status === 401) {
          clearInterval(interval);
        }
      }
    };

    checkNotifications();

    interval = setInterval(checkNotifications, 15000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    hasNewIncoming,
    hasNewMyRequests,

    // 🔴 CLEAR WHEN PAGE OPENED
    clearIncoming: (count) => {
      localStorage.setItem("lastSeenIncoming", count);
      setHasNewIncoming(false);
    },

    clearMyRequests: () => {
      setHasNewMyRequests(false);
    },
  };
}