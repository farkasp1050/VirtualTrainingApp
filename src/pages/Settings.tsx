import { IonContent, IonHeader, IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonPage, IonButtons, IonBackButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Settings: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                        <IonBackButton defaultHref='/dashboard'/>
                        <IonTitle className='ion-text-end'>Settings</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonSelect label='Theme' labelPlacement='floating'>
                        <IonSelectOption value="dark">Dark</IonSelectOption>
                        <IonSelectOption value="light">Light</IonSelectOption>
                    </IonSelect>
                    <IonSelect label='Language' labelPlacement='floating'>
                        <IonSelectOption value="magyar">Magyar</IonSelectOption>
                        <IonSelectOption value="english">English</IonSelectOption>
                    </IonSelect>
                    <IonItem>
                        <IonInput label="Version" value="1.1.3." disabled={true}></IonInput>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Settings;