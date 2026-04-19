import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user, isSeller } = useAuth();

  const [hasNewIncoming, setHasNewIncoming] = useState(false);
  const [hasNewMyRequests, setHasNewMyRequests] = useState(false);

  useEffect(() => {
    // ✅ Only sellers should poll incoming requests
    if (!user || !isSeller) return;

    let interval;

    const checkNotifications = async () => {
      try {
        const res = await API.get("/requests/incoming");

        const incoming = res.data.requests;

        const lastSeen =
          Number(localStorage.getItem("lastSeenIncoming")) || 0;

        if (incoming.length > lastSeen) {
          setHasNewIncoming(true);
        }

      } catch (err) {
        console.error("Notification error:", err);
      }
    };

    // 🔥 run immediately
    checkNotifications();

    // 🔥 polling
    interval = setInterval(checkNotifications, 10000);

    return () => clearInterval(interval);

  }, [user?.id, isSeller]);

  return {
    hasNewIncoming,
    hasNewMyRequests,

    clearIncoming: (count) => {
      localStorage.setItem("lastSeenIncoming", count);
      setHasNewIncoming(false);
    },

    clearMyRequests: () => {
      setHasNewMyRequests(false);
    },
  };
}