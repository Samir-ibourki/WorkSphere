import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

export const useProjectSocket = (projectId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    // 1. Connecter le socket ila ma-kanch connecté
    if (!socket.connected) {
      socket.connect();
    }

    // 2. Rejoindre la Room d had le projet
    socket.emit("join:project", projectId);

    // 3. Handler : melli t-bdel ay tâche, actualiser le cache TanStack Query
    const handleTaskChange = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    // 4. Écouter les 3 événements émis par le backend
    socket.on("task:created", handleTaskChange);
    socket.on("task:updated", handleTaskChange);
    socket.on("task:deleted", handleTaskChange);

    // 5. Cleanup melli l-utilisateur y-khrej mn la page
    return () => {
      socket.emit("leave:project", projectId);
      socket.off("task:created", handleTaskChange);
      socket.off("task:updated", handleTaskChange);
      socket.off("task:deleted", handleTaskChange);
    };
  }, [projectId, queryClient]);
};
