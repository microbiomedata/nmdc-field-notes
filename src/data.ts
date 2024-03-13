import {
  Address,
  AddressForm,
  ContextForm,
  MetadataSubmission,
  MultiOmicsForm,
  StudyForm,
  SubmissionMetadataCreate,
} from "./api";

export const defaultAddress = (): Address => ({
  city: "",
  email: "",
  line1: "",
  line2: "",
  name: "",
  phone: "",
  postalCode: "",
  state: "",
});

export const defaultAddressForm = (): AddressForm => ({
  biosafetyLevel: "",
  comments: "",
  description: "",
  expectedShippingDate: null,
  experimentalGoals: "",
  irbOrHipaa: null,
  permitNumber: "",
  randomization: "",
  sample: "",
  shipper: defaultAddress(),
  shippingConditions: "",
  usdaRegulated: null,
});

export const defaultContextForm = (): ContextForm => ({
  award: null,
  dataGenerated: null,
  datasetDoi: "",
  facilities: [],
  facilityGenerated: null,
  otherAward: "",
});

export const defaultStudyForm = (): StudyForm => ({
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

export const defaultMultiOmicsForm = (): MultiOmicsForm => ({
  GOLDStudyId: "",
  JGIStudyId: "",
  NCBIBioProjectId: "",
  alternativeNames: [],
  omicsProcessingTypes: [],
  studyNumber: "",
});

export const defaultMetadataSubmission = (): MetadataSubmission => ({
  addressForm: defaultAddressForm(),
  contextForm: defaultContextForm(),
  multiOmicsForm: defaultMultiOmicsForm(),
  packageName: "",
  sampleData: {},
  studyForm: defaultStudyForm(),
  templates: [],
});

export const defaultSubmission = (): SubmissionMetadataCreate => ({
  metadata_submission: defaultMetadataSubmission(),
});
