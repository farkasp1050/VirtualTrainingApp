import { IonContent, IonButtons, IonBackButton, IonHeader, IonGrid, IonRow, IonCol, IonIcon, IonAvatar, IonButton, IonList, IonInputPasswordToggle, IonPage, IonTitle, IonToolbar, IonInput, IonText, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { mail, lockClosed, person, exit, personCircle } from 'ionicons/icons';
import registerPicture from '../assets/RegisterPicture.png';
import React from 'react';

const Register: React.FC = () => {
    const router = useIonRouter();

    const handleRgister = (evemz: any) => {
        event?.preventDefault();
        console.log("Register done");
        router.push("/login");
    };

    return (
        <IonPage>
            <IonButtons>
                <IonBackButton defaultHref='/login'/>
            </IonButtons>
            <IonContent className="ion-padding" style={{ marginTop: "100px" }}>
                <div className="ion-text-center ion-padding">
                    <img src={registerPicture} alt="registerPicture" />
                </div>
                <IonText color="secondary">
                    <h2>Create an Account</h2>
                </IonText>
                <form onSubmit={handleRgister}>
                    <IonItem>
                        <IonIcon aria-hidden='true' icon={personCircle} slot='start'></IonIcon>
                        <IonInput label='Full Name' type='text' labelPlacement='floating' fill='outline' placeholder='John Doe'></IonInput>
                    </IonItem>
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
                                    Register
                                    <IonIcon icon={person} style={{ marginLeft: "5px" }}></IonIcon>
                                </IonButton>
                            </IonCol>
                            <IonCol size='6'>
                                <IonButton routerLink='/login' color={'secondary'} shape='round' className='ion-margin-top' expand='block'>
                                    Login
                                    <IonIcon icon={exit} style={{ marginLeft: "5px" }}></IonIcon>
                                    </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default Register;