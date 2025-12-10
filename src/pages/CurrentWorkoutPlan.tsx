import { IonContent, IonHeader, IonPage, IonTitle, IonCard, IonCardTitle, IonButtons, IonBackButton, IonCardHeader, IonCardContent, IonToast, IonToolbar, IonCardSubtitle } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';

import { Check } from "lucide-react";

import "./CurrentWorkoutPlan.css";

import { useTranslation } from 'react-i18next';

import { supabase } from '../services/supabaseClient';

interface Exercises{
    duration: string,
    equipment: string,
    name: string,
    repetitions: string,
    sets: string
}

interface ExerciseData{
    day: string,
    exercises: Exercises[]
}

interface workouts{
    id: string,
    created_at: Date,
    user_id: string,
    workoutPlan_id: string,
    exercise: ExerciseData[],
    workoutFinished: number,
    finished: boolean
}

const CurrentWorkoutPlan: React.FC = () => {
    const { t } = useTranslation("CurrentWorkoutPlan");
    const { workoutPlanId } = useParams<{ workoutPlanId: string }>();
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ workouts, setWorkouts ] = useState<workouts | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
            
            setUserId(userData.user.id);
    
            const { data: workoutData, error: workoutDataError } = await supabase
            .from("workouts")
            .select("id, created_at, user_id, workoutPlan_id, exercise, workoutFinished, finished")
            .eq("workoutPlan_id", workoutPlanId)
            .eq("user_id", userData.user.id)
            .single();
    
            if(workoutDataError){
                console.log(workoutDataError);
                setMessage("Workout not found!");
                return;
            }
    
            setWorkouts(workoutData);
        }
    
        fetchUserData();
    }, []);
    
    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref='/myWorkoutPlans'/>
                    <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                {!workouts && (
                    <p>You dont have a workout plan yet. Create one now!</p>
                )}
                {workouts && workouts.exercise.map((workout, index) => (
                    <IonCard key={index} routerLink={`/currentWorkout/${workoutPlanId}/${index}`}>
                        <IonCardHeader>
                            <IonCardTitle>{index + 1}# workout</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>{workout.day}</IonCardContent>
                    </IonCard>
                ))}
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

export default CurrentWorkoutPlan;