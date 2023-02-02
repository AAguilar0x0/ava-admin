export type Project = {
  id: string;
  name: string;
  description: string;
  repo: string;
  url: string;
  tech_stack: Array<string>;
};

export const defaultProject: Project = {
  id: '',
  name: '',
  description: '',
  repo: '',
  url: '',
  tech_stack: []
};

export default Project;
