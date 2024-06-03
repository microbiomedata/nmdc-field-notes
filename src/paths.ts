const IN = "/in";
const STUDY = `${IN}/study`;

const paths = {
  root: "/",
  home: STUDY,
  checklist: "/checklist",
  tour: "/tour",
  welcome: "/welcome",
  login: "/login",
  token: "/token",
  logout: "/logout",
  studyCreate: `${STUDY}/create`,
  studyView: (submissionId: string) => `${STUDY}/${submissionId}`,
  studyEdit: (submissionId: string) => `${STUDY}/${submissionId}/edit`,
  sample: (submissionId: string, sampleIndex: string | number) =>
    `${STUDY}/${submissionId}/sample/${sampleIndex}`,
  guide: `${IN}/guide`,
  settings: `${IN}/settings`,
};

export default paths;
export { IN, STUDY };
