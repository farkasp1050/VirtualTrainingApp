import { IonContent, IonButtons, IonBackButton, IonToast, IonGrid, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter, IonHeader } from '@ionic/react';
import { mail, lockClosed, person, exit, personCircle } from 'ionicons/icons';
import registerPicture from '../../assets/RegisterPicture.png';
import { supabase } from '../../services/supabaseClient';
import React, { useState } from 'react';

import styles from "./Register.module.css";

import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
    const { t } = useTranslation("Register");
    const router = useIonRouter();
    const [ password, setPassword ] = useState("");
    const [ fullName, setFullName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);

    const handleRgister = async (event: any) => {
        event.preventDefault();
		setMessage("");
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if(error){
            console.log(error.message);
            setMessage(`Something went wrong with the registration! ${error.message}`);
            return;
        }

        if(data){
            await supabase.from("users").insert({
                fullName: fullName,
                email: email
            });
        }

        const { error: badgeError } = await supabase
        .from("badges")
        .insert({
            user_id: data.user?.id,
            post: 0,
            friends: 0,
            postReply: 0,
            addedFood: 0
        });

        if(badgeError){
            console.log(badgeError.message);
            setMessage(`Something went wrong with the registration! ${badgeError.message}`);
            return;
        }
        
        setMessage("Registration was successful!");
        setShowToast(true);
        router.push("/login");
    };

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/login'/>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                <div className={styles.grid}>
                    <IonGrid>
                        <IonRow className={styles.mainRow}>
                            <IonCol className={styles.mainCol} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                                <div className={styles.imageContainer}>
                                    <img src={registerPicture} alt="registerPicture" className={styles.image}/>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow className={styles.subRow}>
                            <IonCol className={styles.subCol} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                                <IonText color="secondary" className={styles.titleContainer}>
                                    <h2 className={styles.title}>{t("createAccount")}</h2>
                                </IonText>
                                <form onSubmit={handleRgister} className={styles.form}>
                                    <IonItem className={styles.item}>
                                        <IonIcon aria-hidden='true' icon={personCircle} slot='start' className={styles.icon}></IonIcon>
                                        <IonInput className={styles.input} label={t("fullName")} value={fullName} onIonChange={e => setFullName(String(e.detail.value))} type='text' labelPlacement='floating' fill='outline' required placeholder={t("namePlaceholder")}></IonInput>
                                    </IonItem>
                                    <IonItem className={styles.item}>
                                        <IonIcon aria-hidden='true' icon={mail} slot='start' className={styles.icon}></IonIcon>
                                        <IonInput className={styles.input} label={t("email")} onIonChange={e => setEmail(String(e.detail.value))} value={email} type='email' labelPlacement='floating' fill='outline' required placeholder={t("emailPlaceholder")}></IonInput>
                                    </IonItem>
                                    <IonItem className={styles.item}>
                                        <IonIcon aria-hidden='true' icon={lockClosed} slot='start' className={styles.icon}></IonIcon>
                                        <IonInput className={styles.input} value={password} onIonChange={e => setPassword(String(e.detail.value))} label={t("password")} type='password' labelPlacement='floating' fill='outline' required placeholder='***********'>
                                            <IonInputPasswordToggle slot='end'></IonInputPasswordToggle>
                                        </IonInput>
                                    </IonItem>
                                    <IonButton className={styles.registerButton} type='submit' shape='round' expand='block'>
                                        {t("register")}
                                        <IonIcon icon={person} className={styles.icon}></IonIcon>
                                    </IonButton>
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

export default Register;