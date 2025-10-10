import { IonContent, IonHeader, IonItem, IonList, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonInput, IonAvatar, IonIcon, IonPage, IonButton, IonButtons, IonBackButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { checkmark } from "ionicons/icons";

import './Profile.css';

const Profile: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-center'>Profile</IonTitle>
                    <IonButtons>
                        <IonButton><IonIcon icon={checkmark}></IonIcon></IonButton>
                    </IonButtons>
                </IonButtons>
                
            </IonHeader>
            <IonContent className="ion-padding ion-text-center">
                <IonAvatar>
                    <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Demo Avatar Picture" />
                </IonAvatar>
                
                <IonList>
                    <IonItem>
                        <IonInput label='Full Name' type='text' labelPlacement='floating' fill='outline' placeholder='John Doe'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Email' type='email' labelPlacement='floating' fill='outline' placeholder='somebody@something.com'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Age' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Weight' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Height' type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonSelect label='Gender' labelPlacement='floating'>
                        <IonSelectOption value="male">Male</IonSelectOption>
                        <IonSelectOption value="female">Female</IonSelectOption>
                    </IonSelect>
                    <IonGrid>
                        <IonRow>
                           <IonCol size='6'>
                                <IonButton color={'primary'} shape='round' className='ion-margin-top' expand='block'>
                                    Delete Account
                                  <IonIcon style={{ marginLeft: "5px" }}></IonIcon>
                                  </IonButton>
                            </IonCol>
                            <IonCol size='6'>
                                <IonButton color={'secondary'} shape='round' className='ion-margin-top' expand='block'>
                                    Update Information
                                </IonButton>
                            </IonCol>
                         </IonRow>
                    </IonGrid>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Profile;