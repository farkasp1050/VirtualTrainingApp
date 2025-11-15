import { IonContent, IonButtons, IonBackButton, IonToast, IonGrid, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { mail, lockClosed, person, exit, personCircle } from 'ionicons/icons';
import registerPicture from '../assets/RegisterPicture.png';
import { supabase } from '../services/supabaseClient';
import React, { useState } from 'react';

import "./Register.css";

const Register: React.FC = () => {
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
        
        setMessage("Registration was successful!");
        setShowToast(true);
        router.push("/login");
    };

    return (
        <IonPage className='page'>
            <IonButtons>
                <IonBackButton defaultHref='/login'/>
            </IonButtons>
            <IonContent className="ion-padding page-content" style={{ marginTop: "100px" }}>
                <IonGrid fixed>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                            <div className="ion-text-center ion-padding">
                                <img src={registerPicture} alt="registerPicture" />
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                            <IonText color="secondary">
                                <h2>Create an Account</h2>
                            </IonText>
                            <form onSubmit={handleRgister} className='form'>
                                <IonItem>
                                    <IonIcon aria-hidden='true' icon={personCircle} slot='start'></IonIcon>
                                    <IonInput label='Full Name' value={fullName} onIonChange={e => setFullName(String(e.detail.value))} type='text' labelPlacement='floating' fill='outline' required placeholder='John Doe'></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonIcon aria-hidden='true' icon={mail} slot='start'></IonIcon>
                                    <IonInput label='Email' onIonChange={e => setEmail(String(e.detail.value))} value={email} type='email' labelPlacement='floating' fill='outline' required placeholder='somebody@something.com'></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonIcon aria-hidden='true' icon={lockClosed} slot='start'></IonIcon>
                                    <IonInput className='ion-margin-top' value={password} onIonChange={e => setPassword(String(e.detail.value))} label='Password' type='password' labelPlacement='floating' fill='outline' required placeholder='***********'>
                                        <IonInputPasswordToggle slot='end'></IonInputPasswordToggle>
                                    </IonInput>
                                </IonItem>
                                    <IonRow>
                                        <IonCol size='12'>
                                            <IonButton type='submit' color={'primary'} shape='round' className='ion-margin-top' expand='block'>
                                                Register
                                                <IonIcon icon={person} style={{ marginLeft: "5px" }}></IonIcon>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
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
            </IonContent>
        </IonPage>
    );
};

export default Register;