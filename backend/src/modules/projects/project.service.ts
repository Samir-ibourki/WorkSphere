import prisma from "../../prisma/client.js";
import type { createProjectInput, UpdateProjectInput } from "./project.schema.js";




export const projectService = {
    async createProject(input:createProjectInput, organizationId: string) {
        const project = await prisma.project.create({
            data:{
                name : input.name ,
                description: input.description,
                status: input.status,
                organizationId : organizationId
            },
            
        })
        return project
    },

    async getProjects (organizationId: string){
        return await prisma.project.findMany({
            where:{organizationId},
            orderBy: {createdAt: "desc"},
            include: {
                tasks: true,
            }
        })
    },

    async getProjectById (id:string, organizationId: string){
         const project =await prisma.project.findFirst({
            where: {id, organizationId},
            include: {tasks: true}
        }) 
        if (!project) {
      throw new Error("Project not found");
    }
    return project;
    },

    async updateProject(id: string, input: UpdateProjectInput, organizationId: string){
        const existing = await prisma.project.findFirst({
            where:{id, organizationId}
        })

        if (!existing) {
      throw new Error("Project not found");
        }

    return await prisma.project.update({
      where: { id },
      data: input,
    });

    },

    async deleteProject(id:string, organizationId: string){
        const existing = await prisma.project.findFirst({
            where:{id, organizationId}
        })
        if (!existing) {
      throw new Error("Project not found");
        }

        return await prisma.project.delete({where:{id}})
    }
}




