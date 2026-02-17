import { create } from 'zustand';
import type { Client, Developer, Project, Sprint } from '@/types';
import { clients as mockClients, developers as mockDevs, projects as mockProjects, sprints as mockSprints } from '@/data/mock';

interface AppState {
  projects: Project[];
  clients: Client[];
  developers: Developer[];
  sprints: Sprint[];
  darkMode: boolean;
  sidebarOpen: boolean;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;

  updateDeveloper: (id: string, data: Partial<Developer>) => void;
}

export const useStore = create<AppState>((set) => ({
  projects: mockProjects,
  clients: mockClients,
  developers: mockDevs,
  sprints: mockSprints,
  darkMode: true,
  sidebarOpen: true,

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, data) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
  updateClient: (id, data) =>
    set((s) => ({
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),

  updateDeveloper: (id, data) =>
    set((s) => ({
      developers: s.developers.map((d) => (d.id === id ? { ...d, ...data } : d)),
    })),
}));
