import { IonContent, IonButtons, IonBackButton, IonFabList, IonIcon, IonToast, IonFab, IonFabButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { camera, add, analytics, save } from 'ionicons/icons';
import React from 'react';

import "./FoodRecognizer.css";

import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

import * as tensorflowModel from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

interface Classified{
    className: string;
    probability: number;
}

const FoodRecognizer: React.FC = () => {
    const [ model, setModel ] = useState<tensorflowModel.MobileNet | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ newPhoto, setNewPhoto ] = useState<string | undefined>(undefined);
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');
    const userImageRef = useRef<HTMLImageElement | null>(null);
    const [ classifyResult, setClassifyResult ] = useState<Classified[]>([]);

    const loadModel = async () => {
        setLoading(true);
        try{
            const model = await tensorflowModel.load();
            setModel(model);
            setLoading(false);
        }catch(error){
            console.error(error);
            setMessage("There was an error while calling the model.");
            setShowToast(true);
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        loadModel();
    }, []);

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
        if(model && userImageRef.current){
            const analyzeResult = await model?.classify(userImageRef.current);
            setClassifyResult(analyzeResult);
            console.log(analyzeResult);
        }

        if(classifyResult){
            //todo.
        }
    }

    const savePhotoData = async () => {

    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>Food Recognizer</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className='page-content'>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className='data'>
                    { model && newPhoto && (
                        <img className='photo'
                        src={newPhoto} 
                        alt="User Image"
                        ref={userImageRef} />
                    )}
                    <IonFab slot='fixed' horizontal='center' vertical='bottom' className='magic-button'>
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
                </div>
            )}
            </IonContent>
        </IonPage>
    );
};

export default FoodRecognizer;