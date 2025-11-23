import { IonContent, IonButtons, IonBackButton, IonFabList, IonIcon, IonToast, IonFab, IonFabButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { camera, add, analytics, save } from 'ionicons/icons';
import React from 'react';
import { supabase } from '../services/supabaseClient';

import "./FoodRecognizer.css";

import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

import * as tensorflowModel from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import { fetchFoodData } from "../api";

interface Classified{
    className: string;
    probability: number;
}

interface Nutrient{
    nutrientName: string;
    value: number;
}

const FoodRecognizer: React.FC = () => {
    const [ model, setModel ] = useState<tensorflowModel.MobileNet | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ newPhoto, setNewPhoto ] = useState<string | undefined>(undefined);
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');
    const userImageRef = useRef<HTMLImageElement | null>(null);
    const [ classifyResult, setClassifyResult ] = useState<Classified>();
    const [ foodData, setFoodData ] = useState([]);
    const [ foodNutrients, setFoodNutrients ] = useState<Nutrient[]>([]);
    const [ protein, setProtein ] = useState<number>();
    const [ fat, setFat ] = useState<number>();
    const [ carbonhydrate, setCarbonhydrate ] = useState<number>();
    const [ kcal, setKcal ] = useState<number>();
    const [ userId, setUserId ] = useState("");

    const fetchUserData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError){
                console.log(userError);
                setMessage("User not logged in!");
                setShowToast(true);
                return;
            }
        setUserId(userData.user.id);
    }

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
        fetchUserData();
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
            const analyzeResult = await model.classify(userImageRef.current);
            setClassifyResult(analyzeResult[0]);
        }

        if(classifyResult){
            fetchFoodData(classifyResult.className.toUpperCase())
                .then(data => {
                    setFoodData(data.data.foods);
                    setFoodNutrients(data.data.foods.foodNutrients.map((n: any) => ({
                        name: n.nutrientName,
                        value: n.value
                    })));

                    console.log(data.data);
                    console.log(data.data.foods.foodNutrients);
                })
                .catch(error => {
                    console.error(error);
                    setMessage("There was an error getting the food data.");
                    setShowToast(true);
                })
        }

        if(foodNutrients != null){
            setKcal(foodNutrients.find(n => n.nutrientName === 'Energy')?.value);
            setCarbonhydrate(foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value);
            setProtein(foodNutrients.find(n => n.nutrientName === 'Protein')?.value);
            setFat(foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value);

            console.log(kcal);
            console.log(carbonhydrate);
            console.log(protein);
            console.log(fat);
        }
    }

    const savePhotoData = async () => {
        const { error: saveDataError } = await supabase
        .from("foods")
        .insert({
            user_id: userId,
            quantity: 1,
            foodName: foodData,
            calorie: kcal,
            carbonhydrate: carbonhydrate,
            fat: fat,
            protein: protein
        });
        
        if(saveDataError){
            setMessage("There was an error getting the food data.");
            setShowToast(true);
            return;
        }
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
                    {(foodData) && (
                        <div className='foodResult'>
                            <p>{classifyResult?.className}</p>
                            <p>Kcal: {kcal}</p>
                            <p>Carbs: {carbonhydrate}</p>
                            <p>Fat: {fat}</p>
                            <p>Protein: {protein}</p>
                        </div>
                    )}
                </div>
            )}

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