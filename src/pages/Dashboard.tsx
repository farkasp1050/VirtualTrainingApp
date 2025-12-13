import { IonContent, IonHeader, IonItemDivider, IonIcon, IonToast, IonMenuToggle, IonButton, IonMenuButton, IonFooter, IonList, IonItem, IonButtons, IonPage, IonSplitPane, IonRouterOutlet, IonMenu, IonTitle, IonToolbar, useIonRouter, IonCard, IonCardTitle, IonCardSubtitle, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { settingsSharp, walkSharp, personSharp, barbellSharp, scanSharp, chatbubblesSharp, informationCircleSharp, personAddSharp, chatboxEllipsesSharp, fastFoodSharp } from 'ionicons/icons';

import styles from "./Dashboard.module.css";

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

    const [ userName, setUserName ] = useState("");

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

            const { data: userNameData, error: userNameDataError } = await supabase
            .from("users")
            .select("fullName")
            .eq("id", userData.user.id)
            .single();

            if(userNameDataError){
                console.log(userNameDataError);
                setMessage(`User not found! ${userNameDataError?.message}`);
                return;
            }

            setUserName(userNameData.fullName);

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
        <IonMenu type={"push"} contentId='main-content' className={styles.menuContainer}>
            <IonHeader className={styles.menuHeader}>
                <IonToolbar className={styles.ionHeaderToolBar}>
                    <IonTitle className={styles.menuTitle}>
                        {t("title")}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className={styles.menuContent}>
                <IonList className={styles.menuList}>
                    <IonMenuToggle>
                        <IonItem routerLink='/settings' className={styles.menuItem} lines='none'>
                            <IonIcon icon={settingsSharp} slot='start' className={styles.menuIcon}/>
                            <IonLabel>{t("settings")}</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/profile' className={styles.menuItem} lines='none'>
                            <IonIcon icon={personSharp} className={styles.menuIcon} slot='start'/>
                            <IonLabel>{t("profile")}</IonLabel>
                        </IonItem>
                        <IonItemDivider className={styles.divider}></IonItemDivider>
                        <IonItem routerLink='/foodKB' className={styles.menuItem} lines='none'>
                            <IonIcon icon={informationCircleSharp} className={styles.menuIcon} slot='start'/>
                            <IonLabel>{t("foodKB")}</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/addFriends' className={styles.menuItem} lines='none'>
                            <IonIcon icon={personAddSharp} className={styles.menuIcon} slot='start'/>
                            <IonLabel>{t("addFriends")}</IonLabel>
                        </IonItem>
                        <IonItemDivider className={styles.divider}></IonItemDivider>
                        <IonItem routerLink='/workoutGenerator' className={styles.menuItem} lines='none'>
                            <IonIcon icon={barbellSharp} className={styles.menuIcon} slot='start'/>
                            <IonLabel>{t("workoutGenerator")}</IonLabel>
                        </IonItem>
                        <IonItem routerLink='/myWorkoutPlans' className={styles.menuItem} lines='none'>
                            <IonIcon icon={walkSharp} className={styles.menuIcon} slot='start'/>
                            <IonLabel>{t("myWorkouts")}</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
            <IonButton className={styles.logoutButton} onClick={handleLogOut}>{t("logout")}</IonButton>
        </IonMenu>
        <IonPage id='main-content' className={styles.page}>
            <IonHeader>
                <IonButtons slot="start">
                    <IonMenuButton className={styles.menuButton}></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                <h1 className={styles.greetings}>Welcome {userName}!</h1>

                <IonGrid className={styles.grid}>
                    <IonRow>
                        <IonCol size='6'>
                            <IonItem routerLink='/foodRecognizer' className={styles.gridItem} lines='none'>
                                <IonIcon icon={scanSharp} className={styles.gridItemIcon} slot='start'/>
                                <IonLabel className={styles.gridItemLabel}>{t("foodRecognizer")}</IonLabel>
                            </IonItem>
                        </IonCol>
                        <IonCol size='6'>
                            <IonItem routerLink='/forum' className={styles.gridItem} lines='none'>
                                <IonIcon icon={chatboxEllipsesSharp} className={styles.gridItemIcon} slot='start'/>
                                <IonLabel className={styles.gridItemLabel}>{t("forum")}</IonLabel>
                            </IonItem>
                        </IonCol>
                        <IonCol size='6'>
                            <IonItem routerLink='/myChats' className={styles.gridItem} lines='none'>
                                <IonIcon icon={chatbubblesSharp} className={styles.gridItemIcon} slot='start'/>
                                <IonLabel className={styles.gridItemLabel}>{t("myChats")}</IonLabel>
                            </IonItem>
                        </IonCol>
                        <IonCol size='6'>
                            <IonItem routerLink='/mealPlanner' className={styles.gridItem} lines='none'>
                                <IonIcon icon={fastFoodSharp} className={styles.gridItemIcon} slot='start'/>
                                <IonLabel className={styles.gridItemLabel}>{t("mealPlanner")}</IonLabel>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>

            <IonToast
                isOpen={showToast}
                message={message}
                duration={3000}
                onDidDismiss={() => setShowToast(false)}
            />
        </IonPage>
       </>
    );
};

export default Dashboard;