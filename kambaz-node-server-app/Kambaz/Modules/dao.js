import db from "../Database/index.js";

let { modules } = db;

export const findAllModules = () => modules;

export const findModuleById = (moduleId) => modules.find((module) => module._id === moduleId);

export const findModulesForCourse = (courseId) => modules.filter((module) => module.course === courseId);

export const createModule = (module) => {
  const newModule = { ...module, _id: new Date().getTime().toString() };
  modules = [...modules, newModule];
  return newModule;
};

export const updateModule = (moduleId, module) => {
  modules = modules.map((m) => (m._id === moduleId ? { ...module, _id: moduleId } : m));
  return module;
};

export const deleteModule = (moduleId) => {
  modules = modules.filter((module) => module._id !== moduleId);
}; 