import React from "react";
import { IonCard, IonCardContent, IonItem, IonList } from "@ionic/react";
import { useParams } from "react-router";

interface Props {}

const StudyView: React.FC<Props> = () => {
  // FIXME: Sometimes, when navigating via client-side routing, the `params` object is `{}` and I don't know why.
  //        Example: Edit address bar to `/home` and press Enter, click "Studies" tab, click a study, and see console;
  //                 then, reload the page (still on the study page) and see that the console shows a non-empty object.
  //        I wonder whether it is related to the following Ionic issue, which has been unresolved since 2021:
  //        https://github.com/ionic-team/ionic-framework/issues/23743
  const params = useParams<{ id: string }>();
  console.debug("params", params);
  const { id } = params;

  return (
    <IonCard>
      <IonCardContent>
        <p>
          <code># TODO: Implement StudyView</code>
        </p>
        <IonList>
          <IonItem>id: {id}</IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default StudyView;
