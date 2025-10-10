import { IonContent, IonHeader, IonButtons, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Forum: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>Forum</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                Forum UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default Forum;