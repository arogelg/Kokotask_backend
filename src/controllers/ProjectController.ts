import type { Request, Response } from 'express'
import Project from '../models/project'

export class ProjectController{

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        //Assign the manager to the project
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Project created successfully')
        } catch (error) {
            console.log(error.message)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: {$in: req.user.id} },
                    { team: {$in: req.user.id} }
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error retrieving projects'); 
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
    
        try {
            const project = await Project.findById(id).populate('tasks');
    
            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({ error: error.message });
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                const error = new Error('Not Valid Action');
                return res.status(401).json({ error: error.message });
            }
    
            res.json(project);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error retrieving project');
        }
    }

    static updateProject = async (req: Request, res: Response) => {

        try {

            req.project.projectName = req.body.projectName; 
            req.project.sectionName = req.body.sectionName;
            req.project.description = req.body.description;

            await req.project.save()
            res.send('Project updated successfully');
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error retrieving projects'); 
        }
    }


    static deletProject = async (req: Request, res: Response) => {
        try{

            await req.project.deleteOne()

            res.send('Project deleted successfully');
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error retrieving projects'); 
        }
    }

    static confirmDeleteProject = async (req: Request, res: Response) => {
        //User has to type the project name to confirm the deletion
        const { id } = req.params;
        const { confirm_delete } = req.body;

        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({error: error.message})
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error('Only Manager can delete the project');
                return res.status(401).json({ error: error.message });
            }

            if(project.projectName !== confirm_delete){
                const error = new Error('Project not deleted because confirm name does not match');
                return res.status(401).json({ error: error.message });
            }

            res.send('Project deleted successfully');
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error retrieving projects'); 
        }
    }
}