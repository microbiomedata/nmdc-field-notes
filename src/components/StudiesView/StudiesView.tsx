import React from "react";
import { IonCard, IonCardContent, IonItem, IonList } from "@ionic/react";
import { PATHS } from "../../Router";

interface Props {}

const StudiesView: React.FC<Props> = () => {
  // TODO: Replace this placeholder data with real data.
  const studyIds = ["example-study-a", "example-study-b", "example-study-c"];

  return (
    <IonCard>
      <IonCardContent>
        <p>
          <code># TODO: Implement StudiesView</code>
        </p>
        <IonList>
          {studyIds.map((id) => (
            <IonItem key={id} routerLink={PATHS.STUDY_VIEW.makePath(id)}>
              {id}
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default StudiesView;
