import { IonContent, IonGrid, IonRow, IonCol, IonToast, IonItem, IonInput, IonSelectOption, IonButton, IonSelect, IonPage, useIonRouter, IonIcon, IonText } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

import styles from "./basicDataSplash.module.css";

import { barbellOutline, accessibilityOutline, calendarNumberOutline, maleFemaleOutline, fastFoodOutline, happyOutline } from 'ionicons/icons';

import { useTranslation } from 'react-i18next';

interface userData{
    Age: number,
    Weight: number,
    Height: number,
    Gender: string,
    Goal: number,
    Diet: string
}

const basicDataSplash: React.FC = () => {
    const { t } = useTranslation("basicDataSplash");
    const [ age, setAge ] = useState<number | null>(null);
    const [ isAgeSet, setIsAgeSet ] = useState(false);
    const [ gender, setGender ] = useState("");
    const [ isGenderSet, setIsGenderSet ] = useState(false);
    const [ weight, setWeight ] = useState<number | null>(null);
    const [ isWeightSet, setIsWeightSet ] = useState(false);
    const [ height, setHeight ] = useState<number | null>(null);
    const [ isHeightSet, setIsHeightSet ] = useState(false);
    const [ diet, setDiet ] = useState("");
    const [ isDietSet, setIsDietSet ] = useState(false);
    const [ goal, setGoal ] = useState(0);
    const [ isGoalSet, setIsGoalSet ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ userData, setUserData ] = useState<userData>();
    const router = useIonRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }

            setUserId(userData.user.id);

            const { data: existingData, error: dataFetchError } = await supabase
            .from("users")
            .select("Age, Weight, Height, Gender, Goal, Diet")
            .eq("id", userData.user.id)
            .single();
            
            if(dataFetchError){
                console.log(dataFetchError);
                setMessage(`User not found! ${dataFetchError?.message}`);
                return;
            }

            setUserData(existingData);

            if(existingData.Age !== null && existingData.Diet !== null && existingData.Gender !== null && existingData.Goal !== null && existingData.Height !== null && existingData.Weight !== null){
                router.push('/dashboard');
            }
        }

        fetchUserData();
    }, []);

    const updateUserBasicData = async () => {
        const { data, error } = await supabase
        .from("users")
        .update({
            Age: age,
            Weight: weight,
            Height: height,
            Gender: gender,
            Goal: goal,
            Diet: diet
        })
        .eq("id", userId);

        if(error || !data){
            setMessage(`Update was not successful! ${error?.message}`);
            return;
        }
    }

    return (
        <IonPage className={styles.page}>
            <IonContent className={styles.content}>
                <div className={styles.grid}>
                    <IonGrid>
                        <IonRow className={styles.mainRow}>
                            <IonCol className={styles.mainCol} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                                <IonText className={styles.titleContainer}>
                                    <h2 className={styles.title}>Give some more information</h2>
                                </IonText>
                                <form className={styles.form}>
                                    <IonItem className={styles.item}>
                                        <IonIcon aria-hidden='true' icon={barbellOutline} slot='start' className={styles.icon}></IonIcon>
                                        <IonInput className={styles.input} label='Weight' value={weight} onIonChange={e => { setWeight(Number(e.detail.value)); setIsWeightSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                    </IonItem>
                                    {isWeightSet && (
                                        <IonItem className={styles.item}>
                                            <IonIcon aria-hidden='true' icon={accessibilityOutline} slot='start' className={styles.icon}></IonIcon>
                                            <IonInput className={styles.input} label='Height' value={height} onIonChange={e => { setHeight(Number(e.detail.value)); setIsHeightSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}

                                    {isHeightSet && (
                                        <IonItem className={styles.item}>
                                            <IonIcon aria-hidden='true' icon={calendarNumberOutline} slot='start' className={styles.icon}></IonIcon>
                                            <IonInput className={styles.input} label='Age' value={age} onIonChange={e => { setAge(Number(e.detail.value)); setIsAgeSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}

                                    {isAgeSet && (
                                        <IonItem className={styles.item}>
                                            <IonIcon aria-hidden='true' icon={maleFemaleOutline} slot='start' className={styles.icon}></IonIcon>
                                            <IonSelect className={styles.input} label='Gender' value={gender} onIonChange={(e) => { setGender(String(e.detail.value)); setIsGenderSet(true); }} labelPlacement='floating' placeholder='---Please choose an option---'>
                                                <IonSelectOption value="male">Male</IonSelectOption>
                                                <IonSelectOption value="female">Female</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    )}

                                    {isGenderSet && (
                                        <IonItem className={styles.item}>
                                            <IonIcon aria-hidden='true' icon={fastFoodOutline} slot='start' className={styles.icon}></IonIcon>
                                            <IonInput className={styles.input} label='Diet' value={diet} onIonChange={e => { setDiet(String(e.detail.value)); setIsDietSet(true); }} type='text' labelPlacement='floating' fill='outline'  required placeholder="vegan"></IonInput>
                                        </IonItem>
                                    )}

                                    {isDietSet && (
                                        <IonItem className={styles.item}>
                                            <IonIcon aria-hidden='true' icon={happyOutline} slot='start' className={styles.icon}></IonIcon>
                                            <IonInput className={styles.input} label='Calorie Goal' value={goal} onIonChange={e => { setGoal(Number(e.detail.value)); setIsGoalSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}

                                    {isGoalSet && (
                                        <IonButton className={styles.updateButton} onClick={updateUserBasicData} routerLink="/dashboard" routerDirection='root' shape='round'>Save</IonButton>
                                    )}
                                </form>
                                <IonToast
                                    isOpen={showToast}
                                    message={message}
                                    duration={3000}
                                    onDidDismiss={() => setShowToast(false)}
                                />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
         
    );
};

export default basicDataSplash;