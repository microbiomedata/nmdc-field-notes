import React, {useEffect, useState} from "react";
import {
  IonButton,
  IonContent,
  IonModal,
} from "@ionic/react";
import { Capacitor } from '@capacitor/core';
import {
  BarcodeFormat,
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';
import styles from "./BarcodeScanModal.module.css";

interface BarcodeScanModalModalProps {
  onCancel: () => void;
  onChange: (value: string) => void;
  isOpen: boolean;
  formats: BarcodeFormat[];
}

const BarcodeScanModal: React.FC<BarcodeScanModalModalProps> = ({
  onCancel, onChange, isOpen, formats
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  /* Scan a barcode with a ready-to-use interface without WebView customization.
  On Android, this method is only available on devices with Google Play Services 
  installed. Therefore, no camera permission is required.
  Attention: Before using this method on Android, first check if the Google Barcode  
  Scanner module is available by using isGoogleBarcodeScannerModuleAvailable().
  */
  const scan = async (): Promise<void> => {
    const { barcodes } = await BarcodeScanner.scan({
      formats,
    });
    onChange(barcodes[0].rawValue);
    onCancel();
  }
  
  const installGoogleBarcodeScannerModule = async (): Promise<void> => {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  const requestPermissions = async (): Promise<void> => {
    await BarcodeScanner.requestPermissions();
  }

  useEffect(() => {
    BarcodeScanner.isSupported().then((result) => {
      setIsSupported(result.supported);
    });
    BarcodeScanner.checkPermissions().then((result) => {
      setIsPermissionGranted(result.camera === 'granted');
    });
  }, []);

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
          {isSupported && isPermissionGranted && 
            <IonButton
              color="primary"
              expand="block"
              onClick={scan}
            >
              Scan
            </IonButton>
          }
          {!isSupported && Capacitor.getPlatform() === 'android' &&
            <IonButton
              color="primary"
              expand="block"
              onClick={installGoogleBarcodeScannerModule}
            >
              Install Google Barcode Scanner Module
            </IonButton>
          }
          {!isPermissionGranted && Capacitor.getPlatform() !== 'android' &&
            <IonButton
              color="primary"
              expand="block"
              onClick={requestPermissions}
            >
              Request Permissions
            </IonButton>
          }
        </IonContent>
    </IonModal>
  );
};

export default BarcodeScanModal;
