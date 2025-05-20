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
  country: "",
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
  fundingSources: [],
  alternativeNames: [],
  GOLDStudyId: "",
  NCBIBioProjectId: "",
});

export const initMultiOmicsForm = (): MultiOmicsForm => ({
  award: undefined,
  awardDois: undefined,
  dataGenerated: undefined,
  doe: undefined,
  facilities: [],
  facilityGenerated: undefined,
  JGIStudyId: "",
  mgCompatible: undefined,
  mgInterleaved: undefined,
  mtCompatible: undefined,
  mtInterleaved: undefined,
  omicsProcessingTypes: [],
  otherAward: undefined,
  ship: undefined,
  studyNumber: "",
  unknownDoi: undefined,
});

export const initMetadataSubmission = (): MetadataSubmission => ({
  addressForm: initAddressForm(),
  multiOmicsForm: initMultiOmicsForm(),
  packageName: [],
  sampleData: {},
  studyForm: initStudyForm(),
  templates: [],
});

export const initSubmission = (): SubmissionMetadataCreate => ({
  metadata_submission: initMetadataSubmission(),
  source_client: "field_notes",
});
