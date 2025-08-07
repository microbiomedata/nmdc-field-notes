import React, { useEffect } from "react";
import { IonLabel, IonToggle } from "@ionic/react";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { useStore } from "../../Store";

const KeepAwakeSwitch: React.FC = () => {
  const { isKeepAwakeOn, setIsKeepAwakeOn } = useStore();
  const [isKeepAwakeSupported, setIsKeepAwakeSupported] =
    React.useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const result = await KeepAwake.isSupported();
      setIsKeepAwakeSupported(result.isSupported);
    }
    void init();
  }, []);

  return (
    <IonToggle
      checked={isKeepAwakeOn}
      disabled={!isKeepAwakeSupported}
      onIonChange={(e) => {
        setIsKeepAwakeOn(e.detail.checked);
      }}
    >
      <IonLabel>
        <h3>Keep Screen On</h3>
        <p>
          {isKeepAwakeSupported ? (
            <>May significantly increase battery usage</>
          ) : (
            <>Setting not supported on this device</>
          )}
        </p>
      </IonLabel>
    </IonToggle>
  );
};

export default KeepAwakeSwitch;
