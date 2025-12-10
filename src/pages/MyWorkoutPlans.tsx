import { IonContent, IonHeader, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButtons, IonItem, IonLabel, IonBackButton, IonToast, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';

import { useTranslation } from 'react-i18next';

import "./MyWorkoutPlans.css";

import { supabase } from '../services/supabaseClient';

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
            .select("id, created_at")
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
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                {planExisting ? (
                    <div className='workoutGrid'>
                        <IonCard key={workoutPlanId} routerLink={`/currentWorkoutPlan/${workoutPlanId}`}>
                            <IonCardHeader>
                                <IonCardTitle>{workoutPlan?.seo_title}</IonCardTitle>
                                <IonCardSubtitle>Created At: {new Date(planCreatedAt).toLocaleString()}</IonCardSubtitle>
                                <IonCardSubtitle>Workout Duration: {workoutPlan?.total_weeks}</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>{workoutPlan?.seo_content}</IonCardContent>
                        </IonCard>
                    </div>
                ) : (
                    <p>You dont have any workout plans yet! Create one now!</p>
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