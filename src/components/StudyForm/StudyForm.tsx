import React from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
} from "@ionic/react";
import RequiredMark from "../RequiredMark/RequiredMark";
import SectionHeader from "../SectionHeader/SectionHeader";
import { SubmissionMetadataCreate, TemplateName, TEMPLATES } from "../../api";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../Store";
import { StepType } from "@reactour/tour";
import styles from "./StudyForm.module.css";
import { useAppTour } from "../AppTourProvider/hooks";
import { TourId } from "../AppTourProvider/AppTourProvider";

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
        Here, you can select the templates that reflect the kinds of
        environments you&apos;ll be collecting samples from.
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

  const { handleSubmit, control, formState, setValue, getValues } =
    useForm<SubmissionMetadataCreate>({
      defaultValues: submission,
      mode: "onTouched",
      reValidateMode: "onChange",
      disabled,
    });

  const handlePIAutoFill = () => {
    if (loggedInUser === null) {
      return;
    }
    setValue("metadata_submission.studyForm.piName", loggedInUser.name);
    if (loggedInUser.email) {
      setValue("metadata_submission.studyForm.piEmail", loggedInUser.email);
    }
    setValue("metadata_submission.studyForm.piOrcid", loggedInUser.orcid);
  };

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

      <div className="ion-padding-bottom">
        <div className="ion-padding-horizontal">
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
              />
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
              />
            )}
          />
        </div>
        {loggedInUser !== null && (
          <IonItem
            button
            detail={false}
            type="button"
            onClick={handlePIAutoFill}
            tabIndex={-1}
          >
            <IonLabel color="primary">
              <h3>I am the Study&apos;s Principal Investigator</h3>
            </IonLabel>
          </IonItem>
        )}
      </div>

      <SectionHeader>Environment</SectionHeader>

      <div className="ion-padding-horizontal ion-padding-bottom">
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
                multiple={Array.isArray(field.value)}
                onIonDismiss={field.onBlur}
                onIonChange={(e) => {
                  // The `packageName` and `templates` fields need to stay in sync.
                  const previousPackageName = getValues(
                    "metadata_submission.packageName",
                  );
                  const newPackageName = e.detail.value;
                  // The value of the `packageName` field is typed to be a string or an array of
                  // strings to ease the transition between the formats that the backend accepts.
                  // Once the transition is complete, this logic can be simplified to only use
                  // the array format.
                  if (typeof previousPackageName === "string") {
                    // If the previous value was a string, just replace the first element of
                    // the templates array with the new package name.
                    setValue("metadata_submission.templates.0", newPackageName);
                  } else if (Array.isArray(previousPackageName)) {
                    // If the previous value was a string, remove all the previous package names
                    // from the templates array and prepend the new package names.
                    const templates = getValues(
                      "metadata_submission.templates",
                    );
                    setValue(
                      "metadata_submission.templates",
                      newPackageName.concat(
                        templates.filter(
                          (template) =>
                            !previousPackageName.includes(
                              template as TemplateName,
                            ),
                        ),
                      ),
                    );
                  }
                  field.onChange(newPackageName);
                }}
                {...field}
              >
                <div slot="label">
                  Templates
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
      </div>

      <IonButton
        data-tour={`${TourId.StudyForm}-3`}
        expand="block"
        className="ion-padding-horizontal"
        type="submit"
        disabled={disabled || (formState.isSubmitted && !formState.isValid)}
      >
        {formState.isSubmitting ? "Saving" : "Save"}
      </IonButton>
    </form>
  );
};

export default StudyForm;
