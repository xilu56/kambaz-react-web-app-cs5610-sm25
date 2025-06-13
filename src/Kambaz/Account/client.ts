import axiosInstance from "../../api/axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signin = async (credentials: any) => {
  const response = await axiosInstance.post(`/api/users/signin`, credentials);
  return response.data;
};

export const signup = async (user: any) => {
  const response = await axiosInstance.post(`/api/users/signup`, user);
  return response.data;
};

export const signout = async () => {
  const response = await axiosInstance.post(`/api/users/signout`);
  return response.data;
};

export const profile = async () => {
  const response = await axiosInstance.post(`/api/users/profile`);
  return response.data;
};

export const updateProfile = async (user: any) => {
  const response = await axiosInstance.put(`/api/users/profile`, user);
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosInstance.put(`/api/users/${user._id}`, user);
  return response.data;
};

export const findMyCourses = async () => {
  const { data } = await axiosInstance.get(`/api/users/current/courses`);
  return data;
};
