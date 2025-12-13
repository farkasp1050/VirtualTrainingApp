import { IonContent, IonHeader, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButtons, IonItem, IonLabel, IonBackButton, IonToast, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';

import { useTranslation } from 'react-i18next';

import { checkmarkOutline } from 'ionicons/icons';

import styles from "./MyWorkoutPlans.module.css";

import { supabase } from '../../services/supabaseClient';

interface Schedule{
    days_per_week: number,
    session_duration: number
}

interface WorkoutPlan{
    goal: string,
    fitness_level: string,
    total_weeks: number,
    schedule: Schedule,
    seo_title: string,
    seo_content: string,
}

const MyWorkouts: React.FC = () => {
    const { t } = useTranslation("MyWorkouts");
    const router = useIonRouter();
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);

    const [ userId, setUserId ] = useState("");
    const [ planExisting, setPlanExisting ] = useState(false);

    const [ workoutPlan, setWorkoutPlan ] = useState<WorkoutPlan | null>(null);
    const [ workoutPlanId, setWorkoutPlanId ] = useState("");
    const [ planCreatedAt, setPlanCreatedAt ] = useState("");
    const [ completedWorkouts, setCompletedWorkouts ] = useState(0);
    const [ isFinished, setIsFinished ] = useState(false);
    const [ maxWorkouts, setMaxWorkouts ] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
        
            setUserId(userData.user.id);

            const { data: workoutPlanData, error: workoutPlanDataError } = await supabase
            .from("workoutPlans")
            .select("id, created_at, maxWorkouts")
            .eq("user_id", userData.user.id)
            .single();

            if(workoutPlanDataError){
                console.log(workoutPlanDataError);
                setMessage("Workout plan data not found!");
                return;
            }

            if(!workoutPlanData){
                return;
            }

            setWorkoutPlanId(workoutPlanData.id);
            setPlanCreatedAt(new Date(workoutPlanData.created_at).toLocaleString());
            setMaxWorkouts(workoutPlanData.maxWorkouts);

            const { data: isWorkoutPlanFinishedData,  error: isWorkoutPlanFinishedDataError } = await supabase
            .from("workouts")
            .select("workoutFinished")
            .eq("user_id", userData.user.id)
            .eq("workoutPlan_id", workoutPlanData.id)
            .single();

            if(isWorkoutPlanFinishedDataError){
                console.log(isWorkoutPlanFinishedDataError);
                setMessage("Error while fetching the user's workout plan!");
                return;
            }

            setCompletedWorkouts(isWorkoutPlanFinishedData.workoutFinished);
            if(isWorkoutPlanFinishedData.workoutFinished === workoutPlanData.maxWorkouts){
                setIsFinished(true);
            }

            const { data: workoutPlan, error: workoutPlanError } = await supabase
            .from("workoutPlans")
            .select("plan")
            .eq("user_id", userData.user.id)
            .single();

            if(workoutPlanError){
                console.log(workoutPlanError);
                setMessage("Workout plan not found!");
                return;
            }

            if(!workoutPlan){
                return;
            }

            setWorkoutPlan(workoutPlan.plan);
            setPlanExisting(true);
        }

        fetchUserData();
    }, []);

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/dashboard'/>
                    <IonTitle className={styles.title}>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                {planExisting ? (
                    <div className={styles.resultContainer}>
                        <IonCard className={styles.card} key={workoutPlanId} routerLink={`/currentWorkoutPlan/${workoutPlanId}`} disabled={isFinished}>
                            <IonCardHeader className={styles.cardHeader}>
                                <IonCardTitle className={styles.cardTitle}>{workoutPlan?.seo_title}</IonCardTitle>
                                <IonCardSubtitle className={styles.cardSubtitle}>{t("createdAt")}: {new Date(planCreatedAt).toLocaleString()}</IonCardSubtitle>
                                <IonCardSubtitle className={styles.cardSubtitle}>{t("workoutDuration")}: {workoutPlan?.total_weeks}</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className={styles.cardContent}>{workoutPlan?.seo_content}</IonCardContent>
                            {isFinished && (<IonIcon className={styles.icon} icon={checkmarkOutline}/>)}
                        </IonCard>
                    </div>
                ) : (
                    <p className={styles.loading}>{t("noPlan")}</p>
                )}
            <IonToast
            isOpen={showToast}
            message={message}
            duration={3000}
            onDidDismiss={() => setShowToast(false)}
            />
            </IonContent>
        </IonPage>
    );
};

export default MyWorkouts;