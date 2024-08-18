import type { Request, Response } from 'express';
export declare class ProjectController {
    static createProject: (req: Request, res: Response) => Promise<void>;
    static getAllProjects: (req: Request, res: Response) => Promise<void>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateProject: (req: Request, res: Response) => Promise<void>;
    static deletProject: (req: Request, res: Response) => Promise<void>;
    static confirmDeleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
