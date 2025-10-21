import { IonContent, IonButtons, IonBackButton, IonFabList, IonImg, IonIcon, IonToast, IonFab, IonFabButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { camera, add, analytics, save } from 'ionicons/icons';
import React from 'react';

import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

import tensorflowJs, { FromPixels } from "@tensorflow/tfjs";
import tensorflowModel from "@tensorflow-models/mobilenet";

const FoodRecognizer: React.FC = () => {
    const [ newPhoto, setNewPhoto ] = useState<string | undefined>(undefined);
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');

    const takePhoto = async () => {
        setMessage("");
        const photo = await Camera.getPhoto({
            quality: 100,
            resultType: CameraResultType.DataUrl,
            allowEditing: true,
            source: CameraSource.Camera
        });

        if (!photo || !photo.dataUrl){
            setMessage("There was an error taking the photo.");
            setShowToast(true);
            return;
        }

        setNewPhoto(photo.dataUrl);
    }

    const analyzePhoto = async () => {

    }

    const savePhotoData = async () => {

    }

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>Food Recognizer</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonImg
                    src={newPhoto}
                />
                <IonFab slot='fixed' horizontal='center' vertical='bottom'>
                    <IonFabButton color="primary">
                        <IonIcon icon={add}/>
                    </IonFabButton>
                    <IonFabList side='end'>
                        <IonFabButton color="primary" onClick={takePhoto}>
                            <IonIcon icon={camera}></IonIcon>
                        </IonFabButton>
                    </IonFabList>
                    <IonFabList side='start'>
                        <IonFabButton color="primary" onClick={analyzePhoto}>
                            <IonIcon icon={analytics}></IonIcon>
                        </IonFabButton>
                    </IonFabList>
                    <IonFabList side='top'>
                        <IonFabButton color="primary" onClick={savePhotoData}>
                            <IonIcon icon={save}></IonIcon>
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
                <IonToast
                    isOpen={showToast}
                    message={message}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                />
            </IonContent>
        </IonPage>
    );
};

export default FoodRecognizer;