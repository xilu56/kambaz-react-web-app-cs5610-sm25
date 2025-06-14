import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "https://kambaz-node-server-app-cs5610-sm25.onrender.com";
export const MODULES_API = `${REMOTE_SERVER}/api/modules`;
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModule = async (module: any) => {
  const response = await axios.post(MODULES_API, module);
  return response.data;
};

export const updateModule = async (moduleId: string, module: any) => {
  const response = await axios.put(`${MODULES_API}/${moduleId}`, module);
  return response.data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
}; 