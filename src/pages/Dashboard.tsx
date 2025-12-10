import { IonContent, IonHeader, IonItemDivider, IonIcon, IonToast, IonMenuToggle, IonButton, IonMenuButton, IonFooter, IonList, IonItem, IonButtons, IonPage, IonSplitPane, IonRouterOutlet, IonMenu, IonTitle, IonToolbar, useIonRouter, IonCard, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { settingsSharp, walkSharp, personSharp, barbellSharp, scanSharp, chatbubblesSharp, informationCircleSharp, personAddSharp, chatboxEllipsesSharp, fastFoodSharp } from 'ionicons/icons';

import "./Dashboard.css";

import { useTranslation } from 'react-i18next';

interface Exercise{
    duration: string,
    equipment: string,
    name: string,
    repetitions: string,
    sets: string
}

interface ExerciseData{
    day: string,
    exercises: Exercise[]
}

interface Schedule{
    days_per_week: number,
    session_duration: number
}

interface WorkoutPlan{
    goal: string,
    fitness_level: string,
    total_weeks: number,
    schedule: Schedule,
    exercises: ExerciseData[];
    seo_title: string,
    seo_content: string,
    seo_keywords: string
}

const Dashboard: React.FC = () => {
    const { t } = useTranslation("Dashboard");
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const router = useIonRouter();

    const [ workoutsDone, setWorkoutsDone ] = useState(0);
    const [ workoutProgression, setWorkoutProgression ] = useState();

    const [ currentWorkoutPlan, setCurrentWorkoutPlan ] = useState<WorkoutPlan | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
            
            setUserId(userData.user.id);

            const { data: userWorkoutPlanData,  error: userWorkoutPlanDataError } = await supabase
            .from("workoutPlans")
            .select("plan")
            .eq("user_id", userData.user.id)
            .single();
            
            if(userWorkoutPlanDataError){
                console.log(userWorkoutPlanDataError);
                setMessage("Error while fetching the user's workout plan!");
                return;
            }

            setCurrentWorkoutPlan(userWorkoutPlanData.plan);

            const { data: workoutsData,  error: workoutsError } = await supabase
            .from("workouts")
            .select("workoutFinished")
            .eq("user_id", userData.user.id)
            .single();
            
            if(workoutsError){
                console.log(workoutsError);
                setMessage("Error while fetching the user's workout plan!");
                return;
            }

            setWorkoutsDone(workoutsData.workoutFinished);

            
        }

        fetchUserData();
    }, []);

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
                        {t("title")}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding page-content'>
                <IonList className='list'>
                    <IonMenuToggle>
                        <IonItem className='menuItem' routerLink='/settings'><IonIcon icon={settingsSharp} className='icon-black-version'></IonIcon>{t("settings")}</IonItem>
                        <IonItem className='menuItem' routerLink='/profile'><IonIcon icon={personSharp} className='icon-black-version'></IonIcon>{t("profile")}</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/foodRecognizer'><IonIcon icon={scanSharp} className='icon-black-version'></IonIcon>{t("foodRecognizer")}</IonItem>
                        <IonItem className='menuItem' routerLink='/foodKB'><IonIcon icon={informationCircleSharp} className='icon-black-version'></IonIcon>{t("foodKB")}</IonItem>
                        <IonItem className='menuItem' routerLink='/mealPlanner'><IonIcon icon={fastFoodSharp} className='icon-black-version'></IonIcon>{t("mealPlanner")}</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/forum'><IonIcon icon={chatboxEllipsesSharp} className='icon-black-version'></IonIcon>{t("forum")}</IonItem>
                        <IonItem className='menuItem' routerLink='/addFriends'><IonIcon icon={personAddSharp} className='icon-black-version'></IonIcon>{t("addFriends")}</IonItem>
                        <IonItem className='menuItem' routerLink='/myChats'><IonIcon icon={chatbubblesSharp} className='icon-black-version'></IonIcon>{t("myChats")}</IonItem>
                        <IonItemDivider className='divider'></IonItemDivider>
                        <IonItem className='menuItem' routerLink='/workoutGenerator'><IonIcon icon={barbellSharp} className='icon-black-version'></IonIcon>{t("workoutGenerator")}</IonItem>
                        <IonItem className='menuItem' routerLink='/myWorkoutPlans'><IonIcon icon={walkSharp} className='icon-black-version'></IonIcon>{t("myWorkouts")}</IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
            <IonFooter className='footer'>
                <IonToolbar className='footerToolbar'>
                    <IonItem className='footerItem'>
                        <IonButton className='logOutButton' onClick={handleLogOut}>{t("logout")}</IonButton>
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
                    <IonMenuButton className='menuButton'></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent className='ion-padding page-content'>
                <IonCard>
                    <IonCardTitle></IonCardTitle>
                    <IonCardSubtitle></IonCardSubtitle>
                </IonCard>
            </IonContent>
        </IonPage>
       </>
    );
};

export default Dashboard;