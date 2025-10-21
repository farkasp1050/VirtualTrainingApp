import { IonContent, IonHeader, IonItemDivider, IonToast, IonMenuToggle, IonButton, IonMenuButton, IonFooter, IonList, IonItem, IonButtons, IonPage, IonSplitPane, IonRouterOutlet, IonMenu, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const router = useIonRouter();

    const handleLogOut = async () => {
        setMessage("");
        const { error } = await supabase.auth.signOut();

        if(error){
            setMessage(`Something went wrong! ${error.message}`);
            return;
        }

        router.push("/login");
    }

    return (
       <>
        <IonMenu type={"push"} contentId='main-content'>
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
                    <IonButton color="danger" onClick={handleLogOut}>Logout</IonButton>
                </IonList>
                <IonToast
                    isOpen={showToast}
                    message={message}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                />
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