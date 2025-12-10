import { IonContent, IonButtons, IonBackButton, IonFabList, IonIcon, IonToast, IonFab, IonFabButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { camera, add, analytics, save } from 'ionicons/icons';
import React from 'react';
import { supabase } from '../services/supabaseClient';

import { incrementFoodAdd } from '../badges';

import "./FoodRecognizer.css";

import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

import * as tensorflowModel from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import { useTranslation } from 'react-i18next';

import { fetchFoodData } from '../api';

interface Classified{
    className: string;
    probability: number;
}

interface Nutrient{
    name: string;
    value: number;
}

interface Food{
    nutrients: Nutrient[];
}

const FoodRecognizer: React.FC = () => {
    const { t } = useTranslation("FoodRecognizer");
    const [ model, setModel ] = useState<tensorflowModel.MobileNet | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ newPhoto, setNewPhoto ] = useState<string | undefined>(undefined);
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');
    const userImageRef = useRef<HTMLImageElement | null>(null);
    const [ classifyResult, setClassifyResult ] = useState<Classified>();
    const [ foodData, setFoodData ] = useState<Food[]>([]);
    const [ foodNutrients, setFoodNutrients ] = useState<Nutrient[]>([]);
    const [ protein, setProtein ] = useState<number>();
    const [ fat, setFat ] = useState<number>();
    const [ carbohydrate, setCarbohydrate ] = useState<number>(0);
    const [ kcal, setKcal ] = useState<number>();
    const [ userId, setUserId ] = useState("");
    const [ sumFoodAdded, setSumFoodAdded ] = useState(0);

    const fetchUserData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError){
                console.log(userError);
                setMessage("User not logged in!");
                setShowToast(true);
                return;
            }
        setUserId(userData.user.id);

        const { count, error: sumFoodCounterError } = await supabase
        .from("foods")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userData.user.id);

        if(sumFoodCounterError){
            console.log(sumFoodCounterError);
            setMessage("Something went wrong while fetching the food data!");
            setShowToast(true);
            return;
        }

        setSumFoodAdded(count ?? 0);
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
            await fetchFoodData(classifyResult.className.toUpperCase())
                .then(data => {
                    console.log(data);
                    setFoodData(data.data.foods[0]);
                    setFoodNutrients(data.data.foods[0].foodNutrients.map((n: any) => ({
                        name: n.nutrientName,
                        value: n.value
                    })));
                })
                .catch(error => {
                    console.error(error);
                    setMessage("There was an error getting the food data.");
                    setShowToast(true);
                })
        }

        if(foodNutrients !== null){
            console.log(foodNutrients);

            foodNutrients.forEach((foodNutrient) => {
                if(foodNutrient.name === 'Energy'){
                    console.log(foodNutrient.value);
                    setKcal(foodNutrient.value);
                }
                if(foodNutrient.name === 'Carbohydrate, by difference'){
                    console.log(foodNutrient.value);
                    setCarbohydrate(foodNutrient.value);
                }
                if(foodNutrient.name === 'Protein'){
                    console.log(foodNutrient.value);
                    setProtein(foodNutrient.value);
                }
                if(foodNutrient.name === 'Total lipid (fat)'){
                    console.log(foodNutrient.value);
                    setFat(foodNutrient.value);
                }
            });
        }
    }

    const savePhotoData = async () => {
        const { error: saveDataError } = await supabase
        .from("foods")
        .insert({
            user_id: userId,
            quantity: 1,
            foodName: classifyResult?.className,
            calorie: kcal,
            carbohydrate: carbohydrate,
            fat: fat,
            protein: protein
        });
        
        if(saveDataError){
            setMessage("There was an error getting the food data.");
            setShowToast(true);
            return;
        }

        const currentFoodNumber = await incrementFoodAdd(sumFoodAdded, userId);
        if(currentFoodNumber === 10){
            setMessage("New badge earned! You are looking out for your health now!");
            setShowToast(true);
        }
            
        setMessage("Food saved in your knowledge base successfully!");
        setShowToast(true);
        setSumFoodAdded(currentFoodNumber);
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className='page-content'>
            {loading ? (
                <h1>{t("loading")}</h1>
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
                            <p>{t("kcal")}: {kcal}</p>
                            <p>{t("carbohydrate")}: {carbohydrate}</p>
                            <p>{t("fat")}: {fat}</p>
                            <p>{t("protein")}: {protein}</p>
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