import { IonContent, IonButtons, IonBackButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const MyChats: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>My Chats</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                MyChats UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default MyChats;