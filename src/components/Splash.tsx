import { IonContent, IonHeader, IonButton, IonIcon, IonPage, IonText, IonTitle, IonToolbar, createAnimation } from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { arrowBack } from 'ionicons/icons';
import { Animation } from '@ionic/react';
import 'swiper/css';

import swiperPic1 from '../assets/swiper1.png';
import swiperPic2 from '../assets/swiper2.png';
import swiperPic3 from '../assets/swiper3.png';
import swiperPic4 from '../assets/swiper4.png';
import swiperPic5 from '../assets/swiper5.png';

interface splashContainer {
    onFinish?: () => void;
}

const Splash: React.FC<splashContainer> = ({ onFinish }) => {
    const animation = useRef<Animation | null>(null);

    const arrowRef = useRef<HTMLIonIconElement | null>(null);
    const arrowRef2 = useRef<HTMLIonIconElement | null>(null);
    const arrowRef3 = useRef<HTMLIonIconElement | null>(null);

    useEffect(() => {
        if(animation.current === null){
            const arrow1 = createAnimation()
                .addElement(arrowRef.current!)
                .duration(2000)
                .iterations(Infinity)
                .fromTo('transform', 'tramséateX(-20px)', 'translateX(-200px)')
                .fromTo('opacity', '1', '0.1');

            const arrow2 = createAnimation()
                .addElement(arrowRef2.current!)
                .duration(2000)
                .iterations(Infinity)
                .fromTo('transform', 'tramséateX(0px)', 'translateX(-180px)')
                .fromTo('opacity', '1', '0.1');

            const arrow3 = createAnimation()
                .addElement(arrowRef3.current!)
                .duration(2000)
                .iterations(Infinity)
                .fromTo('transform', 'tramséateX(20px)', 'translateX(-160px)')
                .fromTo('opacity', '1', '0.1');
            
            animation.current = createAnimation().duration(2000).iterations(Infinity).addAnimation([arrow1, arrow2, arrow3]);
            animation.current?.play();
        }
    }, [arrowRef, arrowRef2, arrowRef3]);

    return (
        <IonPage>
            <IonContent>
                <Swiper>
                    <SwiperSlide>
                        <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                            <img src={swiperPic1} alt="swiperPic1"/>
                            <IonText>
                                <h4>Workout to get healthier!</h4>
                                <h4>
                                    <IonIcon ref={arrowRef} icon={arrowBack}></IonIcon>
                                    <IonIcon ref={arrowRef2} icon={arrowBack}></IonIcon>
                                    <IonIcon ref={arrowRef3} icon={arrowBack}></IonIcon>
                                </h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                            <img src={swiperPic2} alt="swiperPic1" />
                            <IonText>
                                <h4>Share your success with others through our forum!</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                            <img src={swiperPic3} alt="swiperPic1" />
                            <IonText>
                                <h4>Get personalized workout plans!</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                            <img src={swiperPic4} alt="swiperPic1" />
                            <IonText>
                                <h4>Use our food recognizer to recognize and store any food you want!</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='ion-text-center ion-paddding' style={{ marginTop: "100px" }}>
                            <img src={swiperPic5} alt="swiperPic1" />
                            <IonText>
                                <h4>Join us NOW!</h4>
                            </IonText>
                            <IonButton onClick={onFinish}>Lets Get Started</IonButton>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </IonContent>
        </IonPage>
    );
};

export default Splash;