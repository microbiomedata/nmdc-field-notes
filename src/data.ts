import {
  Address,
  AddressForm,
  ContextForm,
  MetadataSubmission,
  MultiOmicsForm,
  StudyForm,
  SubmissionMetadataCreate,
} from "./api";

export const initAddress = (): Address => ({
  city: "",
  email: "",
  line1: "",
  line2: "",
  name: "",
  phone: "",
  postalCode: "",
  state: "",
});

export const initAddressForm = (): AddressForm => ({
  biosafetyLevel: "",
  comments: "",
  description: "",
  expectedShippingDate: null,
  experimentalGoals: "",
  irbOrHipaa: null,
  permitNumber: "",
  randomization: "",
  sample: "",
  shipper: initAddress(),
  shippingConditions: "",
  usdaRegulated: null,
});

export const initContextForm = (): ContextForm => ({
  award: null,
  dataGenerated: null,
  datasetDoi: "",
  facilities: [],
  facilityGenerated: null,
  otherAward: "",
});

export const initStudyForm = (): StudyForm => ({
  contributors: [],
  description: "",
  linkOutWebpage: [],
  piEmail: "",
  piName: "",
  piOrcid: "",
  studyDate: undefined,
  studyName: "",
  notes: "",
});

export const initMultiOmicsForm = (): MultiOmicsForm => ({
  GOLDStudyId: "",
  JGIStudyId: "",
  NCBIBioProjectId: "",
  alternativeNames: [],
  omicsProcessingTypes: [],
  studyNumber: "",
});

export const initMetadataSubmission = (): MetadataSubmission => ({
  addressForm: initAddressForm(),
  contextForm: initContextForm(),
  multiOmicsForm: initMultiOmicsForm(),
  packageName: "", // TODO: CHANGE DEFAULT VALUE TO EMPTY ARRAY WHEN BACKEND IS UPDATED
  sampleData: {},
  studyForm: initStudyForm(),
  templates: [],
});

export const initSubmission = (): SubmissionMetadataCreate => ({
  metadata_submission: initMetadataSubmission(),
  source_client: "field_notes",
});
