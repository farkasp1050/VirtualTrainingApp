import { IonContent, IonHeader, IonPage, IonBackButton, IonButtons, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const WorkoutGenerator: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>Workout Generator</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                Workout Generator UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default WorkoutGenerator;