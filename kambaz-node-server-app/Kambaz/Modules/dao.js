import db from "../Database/index.js";

export const findAllModules = () => db.modules;

export const findModuleById = (moduleId) => db.modules.find((module) => module._id === moduleId);

export const findModulesForCourse = (courseId) => db.modules.filter((module) => module.course === courseId);

export const createModule = (module) => {
  const newModule = { ...module, _id: new Date().getTime().toString() };
  db.modules = [...db.modules, newModule];
  return newModule;
};

export const updateModule = (moduleId, module) => {
  db.modules = db.modules.map((m) => (m._id === moduleId ? { ...module, _id: moduleId } : m));
  return { ...module, _id: moduleId };
};

export const deleteModule = (moduleId) => {
  db.modules = db.modules.filter((module) => module._id !== moduleId);
}; 