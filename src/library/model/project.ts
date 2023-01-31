export type Project = {
  id: string;
  name: string;
  company: string;
  repo: string;
  url: string;
  tech_stack: Array<string>;
};

export const defaultProject: Project = {
  id: '',
  name: '',
  company: '',
  repo: '',
  url: '',
  tech_stack: []
};

export default Project;
