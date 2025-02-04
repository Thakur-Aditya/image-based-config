import axios from "axios";

const API_BASE_URL =
  typeof window === "undefined" ? `https://image-based-config.vercel.app/api` : "/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  sequence: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // Project APIs
  async createProject(data: { name: string; description?: string }) {
    const response = await axios.post<Project>(
      `${API_BASE_URL}/projects`,
      data
    );
    return response.data;
  },

  async getProjects() {
    const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
    return response.data;
  },

  async getProject(projectId: string) {
    const response = await axios.get<Project>(
      `${API_BASE_URL}/projects/${projectId}`
    );
    return response.data;
  },

  // Image APIs
  async uploadImages(projectId: string, images: File[]) {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post<Image[]>(
        `${API_BASE_URL}/projects/${projectId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to delete project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
  async deleteProject(projectId: string) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/projects/${projectId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to delete project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
