export const scholarshipTitles = [
  'DAAD Master Studies in CS',
  'Erasmus Mundus Software Engineering',
  'Global Excellence Scholarship',
];

export const researchProjects = [
  {
    university: 'Northbridge University · Germany',
    title: 'AI for accessible healthcare',
    kind: 'Research assistantship',
    funding: 'Paid · €1,200 per month',
    topic: 'Machine learning · Health informatics',
    deadline: '15 Dec 2026',
  },
  {
    university: 'Riverton Institute · United Kingdom',
    title: 'Distributed systems research',
    kind: 'Research internship',
    funding: 'Funded · £1,500 per month',
    topic: 'Distributed systems · Cloud computing',
    deadline: '20 Dec 2026',
  },
  {
    university: 'Greenfield Lab · Netherlands',
    title: 'Climate data science',
    kind: 'Graduate research project',
    funding: 'Stipend available',
    topic: 'Climate · Data science',
    deadline: '08 Jan 2027',
  },
];

export type ResearchProject = (typeof researchProjects)[number];
