import axiosWithCredentials, { REMOTE_SERVER } from "../../../api/axios";

export const MODULES_API = `${REMOTE_SERVER}/api/modules`;
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findAllModules = async () => {
  const response = await axiosWithCredentials.get(MODULES_API);
  return response.data;
};

export const findModuleById = async (moduleId: string) => {
  const response = await axiosWithCredentials.get(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModule = async (module: any) => {
  const response = await axiosWithCredentials.post(MODULES_API, module);
  return response.data;
};

export const updateModule = async (moduleId: string, module: any) => {
  const response = await axiosWithCredentials.put(`${MODULES_API}/${moduleId}`, module);
  return response.data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
}; 