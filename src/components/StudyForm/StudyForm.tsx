import React from "react";
import {
  IonButton,
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

import styles from "./StudyForm.module.css";

interface StudyFormProps {
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

const StudyForm: React.FC<StudyFormProps> = ({ submission, onSave }) => {
  const { handleSubmit, control, formState, setValue } =
    useForm<SubmissionMetadataCreate>({
      defaultValues: submission,
      mode: "onTouched",
      reValidateMode: "onChange",
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

      <SectionHeader>Environment</SectionHeader>

      <div className="ion-padding">
        <Controller
          name="metadata_submission.packageName"
          rules={{ required: "This field is required" }}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <IonSelect
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
          expand="block"
          className="ion-margin-top"
          type="submit"
          disabled={formState.isDirty && !formState.isValid}
        >
          {formState.isSubmitting ? "Saving" : "Save"}
        </IonButton>
      </div>
    </form>
  );
};

export default StudyForm;
