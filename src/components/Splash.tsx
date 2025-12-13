import { IonContent, IonHeader, IonButton, IonIcon, IonPage, IonText, IonTitle, IonToolbar, createAnimation } from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { arrowBack } from 'ionicons/icons';
import { Animation } from '@ionic/react';

import styles from "./introduction.module.css";

import 'swiper/css';
import 'swiper/css/pagination';

import { useTranslation } from 'react-i18next';

import swiperPic1 from '../assets/swiper1.png';
import swiperPic2 from '../assets/swiper2.png';
import swiperPic3 from '../assets/swiper3.png';
import swiperPic4 from '../assets/swiper4.png';
import swiperPic5 from '../assets/swiper5.png';

interface splashContainer {
    onFinish?: () => void;
}

const Splash: React.FC<splashContainer> = ({ onFinish }) => {
    const { t } = useTranslation("Splash");
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
        <IonPage className={styles.page}>
            <IonContent className={styles.content}>
                <Swiper className={styles.swiperContainer}>
                    <SwiperSlide className={styles.swiperSlide}>
                        <div className={styles.contentContainer}>
                            <img src={swiperPic1} alt="swiperPic1" className={styles.slideImage}/>
                            <IonText className={styles.slideContentContainer}>
                                <h4 className={styles.slideTitle}>{t("firstSlide")}</h4>
                                <h4>
                                    <IonIcon ref={arrowRef} icon={arrowBack} className={styles.slideArrows}></IonIcon>
                                    <IonIcon ref={arrowRef2} icon={arrowBack} className={styles.slideArrows}></IonIcon>
                                    <IonIcon ref={arrowRef3} icon={arrowBack} className={styles.slideArrows}></IonIcon>
                                </h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperSlide}>
                        <div className={styles.contentContainer}>
                            <img src={swiperPic2} alt="swiperPic1" className={styles.slideImage}/>
                            <IonText className={styles.slideContentContainer}>
                                <h4 className={styles.slideTitle}>{t("secondSlide")}</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperSlide}>
                        <div className={styles.contentContainer}>
                            <img src={swiperPic3} alt="swiperPic1" className={styles.slideImage}/>
                            <IonText className={styles.slideContentContainer}>
                                <h4 className={styles.slideTitle}>{t("thirdSlide")}</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperSlide}>
                        <div className={styles.contentContainer}>
                            <img src={swiperPic4} alt="swiperPic1" className={styles.slideImage}/>
                            <IonText className={styles.slideContentContainer}>
                                <h4 className={styles.slideTitle}>{t("fourthSlide")}</h4>
                            </IonText>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperSlide}>
                        <div className={styles.contentContainer}>
                            <img src={swiperPic5} alt="swiperPic1" className={styles.slideImage}/>
                            <IonText className={styles.slideContentContainer}>
                                <h4 className={styles.slideTitle}>{t("fifthSlide")}</h4>
                            </IonText>
                            <IonButton onClick={onFinish} className={styles.button}>{t("startButton")}</IonButton>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </IonContent>
        </IonPage>
    );
};

export default Splash;