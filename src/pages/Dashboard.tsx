import { IonContent, IonHeader, IonItemDivider, IonIcon, IonToast, IonMenuToggle, IonButton, IonMenuButton, IonFooter, IonList, IonItem, IonButtons, IonPage, IonSplitPane, IonRouterOutlet, IonMenu, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { settingsSharp, walkSharp, personSharp, barbellSharp, scanSharp, chatbubblesSharp, informationCircleSharp, personAddSharp, chatboxEllipsesSharp, fastFoodSharp } from 'ionicons/icons';

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
            <IonHeader className='header'>
                <IonToolbar className='toolbar'>
                    <IonTitle>
                        Virtual Workout Assistant App
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding page-content'>
                <IonList className='list'>
                    <IonMenuToggle>
                        <IonItem className='menuItem' routerLink='/settings'><IonIcon icon={settingsSharp} className='icon-black-version'></IonIcon>Settings</IonItem>
                        <IonItem className='menuItem' routerLink='/profile'><IonIcon icon={personSharp} className='icon-black-version'></IonIcon>Profile</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/foodRecognizer'><IonIcon icon={scanSharp} className='icon-black-version'></IonIcon>Food Recognizer</IonItem>
                        <IonItem className='menuItem' routerLink='/foodKB'><IonIcon icon={informationCircleSharp} className='icon-black-version'></IonIcon>FoodKB</IonItem>
                        <IonItem className='menuItem' routerLink='/mealPlanner'><IonIcon icon={fastFoodSharp} className='icon-black-version'></IonIcon>Meal Planner</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/forum'><IonIcon icon={chatboxEllipsesSharp} className='icon-black-version'></IonIcon>Forum</IonItem>
                        <IonItem className='menuItem' routerLink='/addFriends'><IonIcon icon={personAddSharp} className='icon-black-version'></IonIcon>Add Friends</IonItem>
                        <IonItem className='menuItem' routerLink='/myChats'><IonIcon icon={chatbubblesSharp} className='icon-black-version'></IonIcon>My Chats</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/workoutGenerator'><IonIcon icon={barbellSharp} className='icon-black-version'></IonIcon>Workout Generator</IonItem>
                        <IonItem className='menuItem' routerLink='/myWorkouts'><IonIcon icon={walkSharp} className='icon-black-version'></IonIcon>My Workouts</IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
            <IonFooter className='footer'>
                <IonToolbar className='footerToolbar'>
                    <IonItem className='footerItem'>
                        <IonButton className='logOutButton' onClick={handleLogOut}>Logout</IonButton>
                    </IonItem>
                </IonToolbar>
                <IonToast
                    isOpen={showToast}
                    message={message}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                />
            </IonFooter>
        </IonMenu>
        <IonPage id='main-content' className='page'>
            <IonHeader>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent className='ion-padding page-content'>Dashboard UI goes here...</IonContent>
        </IonPage>
       </>
    );
};

export default Dashboard;