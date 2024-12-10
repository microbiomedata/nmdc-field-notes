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
  sample: (
    submissionId: string,
    template: string,
    sampleIndex: string | number,
  ) => `${STUDY}/${submissionId}/sample/${template}/${sampleIndex}`,
  guide: `${IN}/guide`,
  settings: `${IN}${SETTINGS}`,
};

export default paths;
export { IN, STUDY };
