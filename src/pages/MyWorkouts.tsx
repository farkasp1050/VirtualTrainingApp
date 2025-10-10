import { IonContent, IonHeader, IonButtons, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const MyWorkouts: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>My Workouts</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                My Workouts UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default MyWorkouts;