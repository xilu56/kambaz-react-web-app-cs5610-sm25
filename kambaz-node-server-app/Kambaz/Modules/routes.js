import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
  const findAllModules = (req, res) => {
    const modules = dao.findAllModules();
    res.json(modules);
  };

  const findModuleById = (req, res) => {
    const { moduleId } = req.params;
    const module = dao.findModuleById(moduleId);
    res.json(module);
  };

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModule = (req, res) => {
    const module = dao.createModule(req.body);
    res.json(module);
  };

  const updateModule = (req, res) => {
    const { moduleId } = req.params;
    const status = dao.updateModule(moduleId, req.body);
    res.json(status);
  };

  const deleteModule = (req, res) => {
    const { moduleId } = req.params;
    dao.deleteModule(moduleId);
    res.sendStatus(204);
  };

  app.get("/api/modules", findAllModules);
  app.get("/api/modules/:moduleId", findModuleById);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/modules", createModule);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
} 