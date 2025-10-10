import { IonContent, IonBackButton, IonButtons, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const FoodKB: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>FoodKB</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                FoodKB UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default FoodKB;