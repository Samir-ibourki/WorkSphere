import prisma from "../../prisma/client.js";

export const dashboardService = {
  async getDashboardStats(organizationId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      recentProjects,
      recentTasks,
      projectsThisWeek,
      tasksThisWeek,
      completedThisWeek,
      membersThisWeek,
    ] = await Promise.all([
      // 1. total projet
      prisma.project.count({
        where: { organizationId },
      }),

      // 2. totale tasks
      prisma.task.count({
        where: { project: { organizationId } },
      }),

      // 3. tasks TODO
      prisma.task.count({
        where: {
          project: { organizationId },
          status: "TODO",
        },
      }),

      // 4. tasks IN_PROGRESS
      prisma.task.count({
        where: {
          project: { organizationId },
          status: "IN_PROGRESS",
        },
      }),

      // 5. tasks DONE (Completed)
      prisma.task.count({
        where: {
          project: { organizationId },
          status: "DONE",
        },
      }),

      // 6. last 5 of projets
      prisma.project.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 7. last 5 of tasks
      prisma.task.findMany({
        where: { project: { organizationId } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),

      // 8. new projects this week
      prisma.project.count({
        where: {
          organizationId,
          createdAt: { gte: oneWeekAgo },
        },
      }),

      // 9. new tasks this week
      prisma.task.count({
        where: {
          project: { organizationId },
          createdAt: { gte: oneWeekAgo },
        },
      }),

      // 10. completed tasks this week
      prisma.task.count({
        where: {
          project: { organizationId },
          status: "DONE",
          updatedAt: { gte: oneWeekAgo },
        },
      }),

      // 11. new members this week
      prisma.user.count({
        where: {
          organizationId,
          createdAt: { gte: oneWeekAgo },
        },
      }),
    ]);

    return {
      stats: {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
      },
      trends: {
        projectsThisWeek,
        tasksThisWeek,
        completedThisWeek,
        membersThisWeek,
      },
      recentProjects,
      recentTasks,
    };
  },
};
