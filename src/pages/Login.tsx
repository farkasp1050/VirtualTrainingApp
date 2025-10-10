import { IonContent, IonHeader, IonGrid, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { mail, lockClosed, person, exit } from 'ionicons/icons';
import loginPicture from '../assets/loginPicture.png';
import React, { useState, useEffect } from 'react';
import Splash from '../components/Splash';
import { Preferences } from '@capacitor/preferences';

const PREF_KEY = 'splashActive';

const Login: React.FC = () => { 
    const router = useIonRouter();
    const [ splashActive, setSplashActive ] = useState(true);

    useEffect(() => {
        const checkPref = async () => {
            const isActive = await Preferences.get({ key: PREF_KEY });
            setSplashActive(isActive.value === "false");
        }
    }, []);

    const handleLogin = () => {
        console.log("Login done");
        router.push("/basicDataSplash");
    };

    const finishedSplash = async () => {
        setSplashActive(false);
        Preferences.set({ key: PREF_KEY, value: 'false' });
    };

    const introAgain = () => {
        setSplashActive(true);
        Preferences.set({ key: PREF_KEY, value: 'true' });
        router.push("/Splash");
    }

    return (
    <>
    {splashActive ? (
        <Splash onFinish={finishedSplash}/>
    ) : (
        <IonPage>
            <IonContent className="ion-padding" style={{ marginTop: "100px" }}>
                <div className="ion-text-center ion-padding">
                    <img src={loginPicture} alt="LoginPicture" />
                </div>
                <IonText color="secondary">
                    <h2>Login</h2>
                </IonText>
                <form onSubmit={handleLogin}>
                    <IonItem>
                        <IonIcon aria-hidden='true' icon={mail} slot='start'></IonIcon>
                        <IonInput label='Email' type='email' labelPlacement='floating' fill='outline' placeholder='somebody@something.com'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonIcon aria-hidden='true' icon={lockClosed} slot='start'></IonIcon>
                        <IonInput className='ion-margin-top' label='Password' type='password' labelPlacement='floating' fill='outline' placeholder='***********'>
                            <IonInputPasswordToggle slot='end'></IonInputPasswordToggle>
                        </IonInput>
                    </IonItem>
                    <IonGrid>
                        <IonRow>
                            <IonCol size='6'>
                                <IonButton type='submit' color={'primary'} shape='round' className='ion-margin-top' expand='block'>
                                    Login
                                    <IonIcon icon={exit} style={{ marginLeft: "5px" }}></IonIcon>
                                </IonButton>
                            </IonCol>
                            <IonCol size='6'>
                                <IonButton routerLink='/register' color={'secondary'} shape='round' className='ion-margin-top' expand='block'>
                                    Register
                                    <IonIcon icon={person} style={{ marginLeft: "5px" }}></IonIcon>
                                    </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <IonButton color={'secondary'} onClick={introAgain} type='button' shape='round'>Watch Intro Again</IonButton>
                </form>
            </IonContent>
        </IonPage>
        )}
    </>
    );
};

export default Login;