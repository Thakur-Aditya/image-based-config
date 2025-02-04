const API_BASE_URL =
  typeof window === "undefined"
    ? `https://image-based-config.vercel.app/api`
    : "/api";

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
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }
    return response.json() as Promise<Project>;
  },

  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return response.json() as Promise<Project[]>;
  },

  async getProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }
    return response.json() as Promise<Project>;
  },

  // Image APIs
  async uploadImages(projectId: string, images: File[]) {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload images: ${response.statusText}`);
      }
      return response.json() as Promise<Image[]>;
    } catch (error) {
      throw new Error(
        `Failed to upload images: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async deleteProject(projectId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(
        `Failed to delete project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
