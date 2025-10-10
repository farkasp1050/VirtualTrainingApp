import { IonContent, IonHeader, IonLabel, IonItem, IonInput, IonSelectOption, IonButton, IonSelect, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import React from 'react';

const basicDataSplash: React.FC = () => {
    const SwiperButtonNext = ({ children }: any) => {
        const swiper = useSwiper();
        return <IonButton onClick={() => swiper.slideNext()}>{children}</IonButton>
    }

    return (
         <Swiper>
            <SwiperSlide>
                <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                    <IonItem>
                        <IonInput className='ion-margin-top' label='Age' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <SwiperButtonNext>Next</SwiperButtonNext>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                    <IonItem>
                        <IonSelect label='Gender' labelPlacement='floating'>
                            <IonSelectOption value="male">Male</IonSelectOption>
                            <IonSelectOption value="female">Female</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <SwiperButtonNext>Next</SwiperButtonNext>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                    <IonItem>
                        <IonInput className='ion-margin-top' label='Weight (kg)' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <SwiperButtonNext>Next</SwiperButtonNext>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                    <IonItem>
                        <IonInput className='ion-margin-top' label='Height' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonButton routerLink='/dashboard' color={'secondary'} shape='round' className='ion-margin-top' expand='block'>Finish</IonButton>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default basicDataSplash;