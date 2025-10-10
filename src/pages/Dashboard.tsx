import { IonContent, IonHeader, IonItemDivider, IonMenuToggle, IonMenuButton, IonFooter, IonList, IonItem, IonButtons, IonPage, IonSplitPane, IonRouterOutlet, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {

    return (
       <>
        <IonMenu contentId='main-content'>
            <IonHeader>
                <IonToolbar color="tertiary">
                    <IonTitle>
                        Virtual Workout Assistant App
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <IonList>
                    <IonMenuToggle>
                        <IonItem routerLink='/settings'>Settings</IonItem>
                        <IonItem routerLink='/profile'>Profile</IonItem>
                        <IonItemDivider></IonItemDivider>
                        <IonItem routerLink='/foodRecognizer'>Food Recognizer</IonItem>
                        <IonItem routerLink='/foodKB'>FoodKB</IonItem>
                        <IonItemDivider></IonItemDivider>
                        <IonItem routerLink='/forum'>Forum</IonItem>
                        <IonItem routerLink='/myChats'>My Chats</IonItem>
                        <IonItemDivider></IonItemDivider>
                        <IonItem routerLink='/workoutGenerator'>Workout Generator</IonItem>
                        <IonItem routerLink='/myWorkouts'>My Workouts</IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
            <IonFooter>
                <IonList>
                    <IonItem routerLink='/login' color="danger">Logout</IonItem>
                </IonList>
            </IonFooter>
        </IonMenu>
        <IonPage id='main-content'>
            <IonHeader>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent className='ion-padding'>Dashboard UI goes here...</IonContent>
        </IonPage>
       </>
    );
};

export default Dashboard;