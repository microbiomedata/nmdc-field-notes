import React from "react";
import { TourProvider, ProviderProps } from "@reactour/tour";
import styles from "./CustomTourProvider.module.css";
import { IonButton } from "@ionic/react";

export enum TourId {
  SampleList = "SampleList",
  StudyForm = "StudyForm",
  StudyList = "StudyList",
  SettingsPage = "SettingsPage",
}

/**
 * Reactour `TourProvider` whose default configuration has been customized for this application.
 *
 * Reference: https://docs.react.tours/tour/props
 */
const CustomTourProvider: React.FC<ProviderProps> = ({
  showBadge = false,
  showCloseButton = false,
  // Note: We disable interaction by default; because interacting with highlighted `select` elements is currently buggy
  //       (i.e. the menu trigger gets highlighted, but the menu list that pops up is not—it is still masked—so we'd
  //       effectively be guiding the user to interact with menu items whose appearance is being subdued at the time).
  disableInteraction = true,
  steps,
  children,
  ...rest
}) => {
  return (
    <TourProvider
      steps={steps}
      styles={{
        // Style the caption.
        popover: (base) => ({
          ...base,
          borderRadius: 4,
          color: "var(--ion-color-primary-contrast)",
        }),
        // Style the hole in the mask (seems to impact light mode only 🤷).
        maskArea: (base) => ({ ...base, rx: 4 }),
        // Style the hole in the mask (seems to impact dark mode only 🤷).
        //
        // Note: The `display: "block"` makes it so the element is visible (in dark mode), which effectively makes
        //       the spotlight effect (in dark mode) and the border radius work. However, it also prevents user
        //       interaction with the highlighted element. To work around that, I added `pointerEvents: none`,
        //       which makes it so pointer events pass right through the highlighter element.
        //       Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
        //
        highlightedArea: (base) => ({
          ...base,
          display: "block",
          pointerEvents: disableInteraction ? "auto" : "none",
          rx: 4,
        }),
        ...rest["styles"],
      }}
      showBadge={showBadge}
      showCloseButton={showCloseButton}
      highlightedMaskClassName={styles.highlightedArea}
      // Ensure the highlighted element is not covered by our navbar.
      inViewThreshold={{ y: 80 }}
      disableInteraction={disableInteraction}
      // If we're at the first step, hide the back arrow
      // (but include an element to preserve the layout).
      prevButton={(props) =>
        props.currentStep === 0 ? (
          <props.Button hideArrow={true} />
        ) : (
          <props.Button kind={"prev"} />
        )
      }
      // If we're at the final step, show an "OK" button.
      nextButton={(props) =>
        props.currentStep + 1 === props.stepsLength ? (
          <IonButton
            size={"small"}
            fill={"solid"}
            color={"light"}
            onClick={() => props.setIsOpen(false)}
          >
            Dismiss
          </IonButton>
        ) : (
          <props.Button kind={"next"} />
        )
      }
      // Disable all "close" methods except the final step of the tutorial.
      // Note: This is in an attempt to simplify development (i.e. shrink the problem space).
      //       It's also risky; since we have to make sure that last step doesn't break!
      onClickClose={showCloseButton ? undefined : () => undefined}
      onClickMask={() => undefined}
      onClickHighlighted={() => undefined}
      {...rest}
    >
      {children}
    </TourProvider>
  );
};

export default CustomTourProvider;
