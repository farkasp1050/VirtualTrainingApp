import { IonContent, IonGrid, IonRow, IonCol, IonToast, IonItem, IonInput, IonSelectOption, IonButton, IonSelect, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

import "./introduction.css";

const basicDataSplash: React.FC = () => {
    const [ age, setAge ] = useState<number | null>(null);
    const [ gender, setGender ] = useState("");
    const [ weight, setWeight ] = useState<number | null>(null);
    const [ height, setHeight ] = useState<number | null>(null);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const router = useIonRouter();

    const updateUserBasicData = async () => {
		setMessage("");
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if(!userData || userError){
            console.log(userError);
            setMessage(`User not found! ${userError?.message}`);
            return;
        }

        const { data: existingData, error: dataFetchError } = await supabase
        .from("users")
        .select("Age, Weight, Height, Gender")
        .eq("id", userData.user.id)
        .single();

        if(dataFetchError){
            console.log(dataFetchError);
            setMessage(`User not found! ${dataFetchError?.message}`);
            return;
        }

        if(existingData.Age != null && existingData.Gender != null && existingData.Height != null && existingData.Weight != null){
            router.push("/dashboard");
            return null;
        }

        const updatedFields: any = {};

        if(!existingData?.Age || existingData.Age === null){
            updatedFields.age = age;
        }
        if(!existingData?.Weight || existingData.Weight === null){
            updatedFields.weight = weight;
        }
        if(!existingData?.Height || existingData.Height === null){
            updatedFields.height = height;
        }
        if(!existingData?.Gender || existingData.Gender === null){
            updatedFields.gender = gender;
        }

        if(Object.keys(updatedFields).length > 0){
            const { data, error } = await supabase
            .from("users")
            .update({
                Age: updatedFields.age,
                Weight: updatedFields.weight,
                Height: updatedFields.height,
                Gender: updatedFields.gender
            })
            .eq("id", userData.user.id);

            if(error || !data){
                setMessage(`Update was not successful! ${error?.message}`);
                return;
            }

            setMessage("");
        }
    }

    const SwiperButtonNext = ({ children }: any) => {
        const swiper = useSwiper();
        return <IonButton onClick={() => swiper.slideNext()}>{children}</IonButton>
    }

    return (
        <IonPage className='page'>
            <IonContent className='page-content'>
                <IonGrid fixed>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                            <Swiper className='swiper'>
                                <SwiperSlide className='swiperSlide'>
                                    <div className='ion-text-center' style={{ marginTop: "100px" }}>
                                        <IonItem lines='none' className='inputContainer'>
                                            <IonInput className='input' type='number' value={age} onIonChange={(e) => setAge(Number(e.detail.value))} label='Age' labelPlacement='floating' fill='outline' required placeholder='123'></IonInput>
                                        </IonItem>
                                        <SwiperButtonNext>Next</SwiperButtonNext>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className='swiperSlide'>
                                    <div className='ion-text-center' style={{ marginTop: "100px" }}>
                                        <IonItem className='inputContainer'>
                                            <IonSelect className='input' label='Gender' onIonChange={(e) => setGender(e.detail.value)} labelPlacement='floating' required>
                                                <IonSelectOption value="male">Male</IonSelectOption>
                                                <IonSelectOption value="female">Female</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                        <SwiperButtonNext>Next</SwiperButtonNext>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className='swiperSlide'>
                                    <div className='ion-text-center' style={{ marginTop: "100px" }}>
                                        <IonItem className='inputContainer'>
                                            <IonInput className='input' label='Weight (kg)' type='number' onIonChange={(e) => setWeight(Number(e.detail.value))} labelPlacement='floating' fill='outline' required placeholder='123'></IonInput>
                                        </IonItem>
                                        <SwiperButtonNext>Next</SwiperButtonNext>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide className='swiperSlide'>
                                    <div className='ion-text-center' style={{ marginTop: "100px" }}>
                                        <IonItem className='inputContainer'>
                                            <IonInput className='input' label='Height' type='number' onIonChange={(e) => setHeight(Number(e.detail.value))} labelPlacement='floating' fill='outline' required placeholder='123'></IonInput>
                                        </IonItem>
                                        <IonButton onClick={updateUserBasicData} routerLink='/dashboard' color={'secondary'} shape='round' className='ion-margin-top' expand='block'>Finish</IonButton>
                                    </div>
                                </SwiperSlide>
                                <IonToast
                                    isOpen={showToast}
                                    message={message}
                                    duration={3000}
                                    onDidDismiss={() => setShowToast(false)}
                                />
                            </Swiper>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
         
    );
};

export default basicDataSplash;