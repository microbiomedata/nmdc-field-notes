import React from "react";
import { IonText, IonIcon } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';

interface TextListItemProps {
  color: string,
  children: string;
}

const TextListItem: React.FC<TextListItemProps> = ({ color, children }) => {
  return (
    <>
      <p>
        <IonText color={color}>
          <IonIcon icon={checkmarkCircle}></IonIcon>
          &nbsp;&nbsp;
        </IonText>
        <IonText color={color}>
          {children}
        </IonText> 
      </p>
    </>
  );
};

export default TextListItem;