import React from "react";
import {
  IonButton,
  IonContent,
  IonModal,
} from "@ionic/react";
import {
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';
import styles from "./BarcodeScanModal.module.css";

interface BarcodeScanModalModalProps {
  onCancel: () => void;
  onChange: (value: string) => void;
  isOpen: boolean;
}

const BarcodeScanModal: React.FC<BarcodeScanModalModalProps> = ({
  onCancel, onChange, isOpen
}) => {
  const scan = async (): Promise<void> => {
    const granted = await requestPermissions();
    if(! granted) {
      cancel();
      return;
    }
    // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#ios
    // Hide everything except the camera feed.
    document
      .querySelector("body")
      ?.classList.add("barcode-scanner-active");

    // Listen for events named "barcodeScanned".
    await BarcodeScanner.addListener(
      "barcodeScanned",
      async (result) => {
        // Remove the event listener (any that are attached).
        // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#removealllisteners
        await BarcodeScanner.removeAllListeners();
        onChange(result.barcode.rawValue);

        // Stop scanning for barcodes.
        // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#stopscan
        await BarcodeScanner.stopScan();
        onCancel();
      },
    );

    // Start scanning for barcodes.
    // Reference: https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning#startscan
    await BarcodeScanner.startScan();
  }
  
  const cancel = async (): Promise<void> => {
    onCancel();
  }

  const requestPermissions = async (): Promise<boolean> => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  return (
    <IonModal
      className={styles.BarcodeScanModal}
      breakpoints={[0, 1]}
      initialBreakpoint={1}
      isOpen={isOpen}
      onIonModalDidDismiss={onCancel}
    >
      <IonContent className="ion-padding">
        <h2>Scan Barcode</h2>
        <IonButton color="primary" expand="block" onClick={onCancel}>
          Cancel
        </IonButton>
        <IonButton
          color="primary"
          expand="block"
          onClick={scan}
        >
          Scan
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default BarcodeScanModal;
