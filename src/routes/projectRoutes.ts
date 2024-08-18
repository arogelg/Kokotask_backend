import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputError } from '../middleware/validation'
import { TaskController } from '../controllers/taskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { ShiftController } from '../controllers/ShiftController'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()


router.use(authenticate)

  /** Routes for projects**/

  router.post(
    "/",
    body("projectName").notEmpty().withMessage("Project name is required"),
    body("sectionName").notEmpty().withMessage("Section is required"),
    body("description").notEmpty().withMessage("Description is required"),
    handleInputError,
    ProjectController.createProject
  );
  router.get("/", ProjectController.getAllProjects);

  router.get(
    "/:id",
    param("id").isMongoId().withMessage("Invalid project id"),
    handleInputError,
    ProjectController.getProjectById
  );


  /** Routes for tasks**/

  router.param('projectId', projectExists)

  router.put(
    "/:projectId",
    param("projectId").isMongoId().withMessage("Invalid project id"),
    body("projectName").notEmpty().withMessage("Project name is required"),
    body("sectionName").notEmpty().withMessage("Section is required"),
    body("description").notEmpty().withMessage("Description is required"),
    handleInputError,
    hasAuthorization,
    ProjectController.updateProject
  );

  router.delete(
      "/:projectId",
      param("projectId").isMongoId().withMessage("Invalid project id"),
      handleInputError,
      hasAuthorization,
      ProjectController.deletProject
    )

  router.post('/:id/confirm-delete',
      param("id").isMongoId().withMessage("Invalid project id"),
      body('confirm_delete').notEmpty().withMessage('Delete confirmation is required'),
      handleInputError,
      ProjectController.confirmDeleteProject
    )

  router.post('/:projectId/tasks',
    body("name").notEmpty().withMessage("Task name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    handleInputError,
    TaskController.createTask
  )

  router.get('/:projectId/tasks',
    TaskController.getProjectTasks
  )

  router.param('taskId', taskExists)
  router.param('taskId', taskBelongsToProject)

  router.get('/:projectId/tasks/:taskId',
    param("taskId").isMongoId().withMessage("Invalid id"),
    handleInputError,
    TaskController.getTaskById
  )

  router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param("taskId").isMongoId().withMessage("Invalid id"),
    body("name").notEmpty().withMessage("Task name is required"),
    body("description").notEmpty().withMessage("Description is required"), 
    handleInputError,
    TaskController.updateTask
  )

  router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param("taskId").isMongoId().withMessage("Invalid id"),
    handleInputError,
    TaskController.deleteTask
  )

  router.post('/:projectId/tasks/:taskId/status',
    param("taskId").isMongoId().withMessage("Invalid id"),
    body("status").notEmpty().withMessage("Status is required"),

    handleInputError,
    TaskController.updateTaskStatus
  )

/** Routes for teams */
router.post('/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('Invalid email'),
  handleInputError,
  TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
  TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
  body('id').isMongoId().withMessage('Invalid id'),
  handleInputError,
  TeamMemberController.addMemberByID
)

router.delete('/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('Invalid id'),
  handleInputError,
  TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('Note Content is required'),
  handleInputError,
  NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('Invalid id'),
  handleInputError,
  NoteController.deleteNote
)

export default router;