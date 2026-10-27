import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

export const useProjectSocket = (projectId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    // 1. Connect socket if doean't connect
    if (!socket.connected) {
      socket.connect();
    }

    // 2. join room of this projet
    socket.emit("join:project", projectId);

    // 3. actualiser the cache TanStack Query
    const handleTaskChange = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    // 4. listen 3 evenements emis for backend
    socket.on("task:created", handleTaskChange);
    socket.on("task:updated", handleTaskChange);
    socket.on("task:deleted", handleTaskChange);

    // 5. Cleanup when user quit the page
    return () => {
      socket.emit("leave:project", projectId);
      socket.off("task:created", handleTaskChange);
      socket.off("task:updated", handleTaskChange);
      socket.off("task:deleted", handleTaskChange);
    };
  }, [projectId, queryClient]);
};
