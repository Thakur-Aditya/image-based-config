"use client";

import { useState, useEffect } from "react";
import { Project } from "../services/api";
import ImageSequenceViewer from "./ImageSequenceViewer";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
        setError(null);
      } else {
        console.log(data.err);
        setError(data.error || "Failed to load projects");
      }
    } catch (err) {
      // setError("Failed to load projects");
      setError(err instanceof Error ? err.message : "Failed to create project");

    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }
      setProjects([...projects, data]);
      setNewProject({ name: "", description: "" });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    }
  };

  const handleImageUpload = async (projectId: string, files: FileList) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload images");
      }

      await loadProjects();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete project");
      }
      setProjects(projects.filter((project) => project.id !== projectId));
      setError(null);
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0A2F2F] text-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-12">Image Scrubber</h1>

        <form
          onSubmit={handleCreateProject}
          className="mb-12 bg-[#0D3B3B] p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full p-3 bg-[#0A2F2F] border border-[#1C4E4E] rounded-lg focus:outline-none focus:border-[#E9F75E] transition-colors"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full p-3 bg-[#0A2F2F] border border-[#1C4E4E] rounded-lg focus:outline-none focus:border-[#E9F75E] transition-colors min-h-[100px]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#E9F75E] text-[#0A2F2F] px-6 py-3 rounded-lg font-semibold hover:bg-[#D4E254] transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-400 mb-6 p-4 bg-[#0D3B3B] rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0D3B3B] rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{project.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const embedUrl = `${window.location.origin}/embed/${project.id}`;
                        const iframeCode = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
                        navigator.clipboard.writeText(iframeCode);
                        alert("Embed code copied to clipboard!");
                      }}
                      className="bg-[#E9F75E] text-[#0A2F2F] px-3 py-1.5 rounded-lg hover:bg-[#265C5C] transition-colors text-sm"
                    >
                      Copy Embed Code
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-300 mt-2 mb-4">
                    {project.description}
                  </p>
                )}
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Add Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleImageUpload(project.id, e.target.files)
                    }
                    className="block w-full text-sm text-gray-300
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#1C4E4E] file:text-white
                      hover:file:bg-[#265C5C]
                      file:cursor-pointer file:transition-colors"
                  />
                </div>
                {project.images && project.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Image Sequence
                    </h3>
                    <ImageSequenceViewer
                      images={project.images.map((img) => img.url)}
                      width={400}
                      height={300}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
