import React from "react";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
} from "@ionic/react";
import RequiredMark from "../RequiredMark/RequiredMark";
import SectionHeader from "../SectionHeader/SectionHeader";
import { SubmissionMetadataCreate, TEMPLATES } from "../../api";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../Store";
import { colorWand as autoFill } from "ionicons/icons";
import { StepType } from "@reactour/tour";
import styles from "./StudyForm.module.css";
import { useAppTour } from "../CustomTourProvider/hooks";
import { TourId } from "../CustomTourProvider/AppTourProvider";

// Make steps for the tour.
const steps: Array<StepType> = [
  {
    selector: `[data-tour="${TourId.StudyForm}-1"]`,
    content: (
      <>
        You can fill in the fields according to the guidance shown. Fields
        marked with <RequiredMark /> are required.
      </>
    ),
  },
  {
    selector: `[data-tour="${TourId.StudyForm}-2"]`,
    content: (
      <>
        Here, you can select a template that reflects the kind of environment
        you&apos;ll be collecting samples from.
      </>
    ),
  },
  {
    selector: `[data-tour="${TourId.StudyForm}-3"]`,
    content: (
      <>
        Finally, once all the required fields are filled in, you can tap
        &quot;Save&quot; to create the study.
      </>
    ),
  },
];

interface StudyFormProps {
  disabled?: boolean;
  submission: SubmissionMetadataCreate;
  onSave: (submission: SubmissionMetadataCreate) => Promise<unknown>;
}

// Based on the email validator from https://zod.dev/
// Allows:
//   - name@example.org
//   - first.last@example.org
//   - name@example.co
// Disallows:
//   - name@example
//   - name@example.c
//   - first..last@example.org
//   - .name@example.org
//   - name.@example.org
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

const StudyForm: React.FC<StudyFormProps> = ({
  disabled,
  submission,
  onSave,
}) => {
  useAppTour(TourId.StudyForm, steps);

  const { loggedInUser } = useStore();

  const { handleSubmit, control, formState, setValue } =
    useForm<SubmissionMetadataCreate>({
      defaultValues: submission,
      mode: "onTouched",
      reValidateMode: "onChange",
      disabled,
    });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="ion-padding">
        <Controller
          name="metadata_submission.studyForm.studyName"
          rules={{ required: "This field is required" }}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <IonInput
                data-tour={`${TourId.StudyForm}-1`}
                className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
                labelPlacement="floating"
                helperText="Provide a study name to associate with your samples."
                errorText={fieldState.error?.message}
                type="text"
                onIonBlur={field.onBlur}
                onIonInput={field.onChange}
                {...field}
              >
                <div slot="label">
                  Name
                  <RequiredMark />
                </div>
              </IonInput>
            );
          }}
        />

        <Controller
          name="metadata_submission.studyForm.description"
          control={control}
          render={({ field, fieldState }) => (
            <IonTextarea
              className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
              label="Description"
              helperText="Provide a description of your study. This should include some general context of your research goals and study design."
              labelPlacement="floating"
              autoGrow
              onIonBlur={field.onBlur}
              onIonInput={field.onChange}
              {...field}
            />
          )}
        />

        <Controller
          name="metadata_submission.studyForm.notes"
          control={control}
          render={({ field, fieldState }) => (
            <IonTextarea
              className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
              label="Notes"
              helperText="Add any additional notes or comments about this study."
              labelPlacement="floating"
              autoGrow
              onIonBlur={field.onBlur}
              onIonInput={field.onChange}
              {...field}
            />
          )}
        />
      </div>

      <SectionHeader>Principal Investigator</SectionHeader>

      <div className="ion-padding">
        <Controller
          name="metadata_submission.studyForm.piName"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
              label="Name"
              helperText="The Principal Investigator who led the study and/or generated the data."
              labelPlacement="floating"
              type="text"
              onIonBlur={field.onBlur}
              onIonInput={field.onChange}
              {...field}
            >
              {/* If the user is logged in, show a button they can press to use their name. */}
              {loggedInUser !== null ? (
                <IonButton
                  fill={"clear"}
                  slot={"end"}
                  title={"Use my name"}
                  aria-label={"Use my name"}
                  onClick={() => setValue(field.name, loggedInUser.name)}
                  disabled={field.value === loggedInUser.name}
                >
                  <IonIcon
                    slot={"icon-only"}
                    icon={autoFill}
                    color={"primary"}
                    aria-hidden={"true"}
                  />
                </IonButton>
              ) : null}
            </IonInput>
          )}
        />

        <Controller
          name="metadata_submission.studyForm.piEmail"
          control={control}
          rules={{
            required: "This field is required",
            validate: {
              validEmail: (value: string) =>
                EMAIL_REGEX.test(value) || "Not a valid email address",
            },
          }}
          render={({ field, fieldState }) => (
            <IonInput
              className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
              helperText="An email address for the Principal Investigator."
              errorText={fieldState.error?.message}
              labelPlacement="floating"
              type="text"
              onIonBlur={field.onBlur}
              onIonInput={field.onChange}
              {...field}
            >
              <div slot="label">
                Email
                <RequiredMark />
              </div>
            </IonInput>
          )}
        />

        <Controller
          name="metadata_submission.studyForm.piOrcid"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
              label="ORCID iD"
              helperText="ORCID iD of the Principal Investigator."
              labelPlacement="floating"
              type="text"
              onIonBlur={field.onBlur}
              onIonInput={field.onChange}
              {...field}
            >
              {/* If the user is logged in, show a button they can press to use their ORCID iD. */}
              {loggedInUser !== null ? (
                <IonButton
                  fill={"clear"}
                  slot={"end"}
                  title={"Use my ORCID iD"}
                  aria-label={"Use my ORCID iD"}
                  onClick={() => setValue(field.name, loggedInUser.orcid)}
                  disabled={field.value === loggedInUser.orcid}
                >
                  <IonIcon
                    slot={"icon-only"}
                    icon={autoFill}
                    color={"primary"}
                    aria-hidden={"true"}
                  />
                </IonButton>
              ) : null}
            </IonInput>
          )}
        />
      </div>

      <SectionHeader>Environment</SectionHeader>

      <div className="ion-padding">
        <Controller
          name="metadata_submission.packageName"
          rules={{ required: "This field is required" }}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <IonSelect
                data-tour={`${TourId.StudyForm}-2`}
                className={`${(fieldState.isTouched || formState.isSubmitted) && "ion-touched"} ${fieldState.invalid && "ion-invalid"}`}
                labelPlacement="floating"
                onIonDismiss={field.onBlur}
                onIonChange={(e) => {
                  // these two fields need to stay in sync
                  setValue("metadata_submission.templates.0", e.detail.value);
                  field.onChange(e.detail.value);
                }}
                {...field}
              >
                <div slot="label">
                  Template
                  <RequiredMark />
                </div>
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <IonSelectOption value={key} key={key}>
                    {template.displayName}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {fieldState.error && (
                <IonText className={styles.errorMessage}>
                  <span>{fieldState.error.message}</span>
                </IonText>
              )}
            </>
          )}
        />

        <IonButton
          data-tour={`${TourId.StudyForm}-3`}
          expand="block"
          className="ion-margin-top"
          type="submit"
          disabled={disabled || (formState.isDirty && !formState.isValid)}
        >
          {formState.isSubmitting ? "Saving" : "Save"}
        </IonButton>
      </div>
    </form>
  );
};

export default StudyForm;
