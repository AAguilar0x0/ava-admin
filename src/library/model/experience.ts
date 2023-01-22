type Experience = {
  id: string;
  role: string;
  name: string;
  company: string;
  description: string;
  start: number;
  end: number;
  tech_stack: Array<string>;
};

export const defaultExperience: Experience = {
  id: '',
  role: '',
  name: '',
  company: '',
  description: '',
  start: 0,
  end: 0,
  tech_stack: []
};

export default Experience;
