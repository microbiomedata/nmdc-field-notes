const IN = "/in";
const STUDY = `/study`;
const SETTINGS = `/settings`;

const paths = {
  root: "/",
  home: `${IN}${STUDY}`,
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
  settings: `${IN}${SETTINGS}`,
  fieldVisibilitySettings: `${SETTINGS}/field-visibility`,
};

export default paths;
export { IN, STUDY };
