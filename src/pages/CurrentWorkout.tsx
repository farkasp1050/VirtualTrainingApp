import { IonContent, IonHeader, IonToast, IonButton, IonButtons, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useRef } from 'react';
import { useIonRouter } from '@ionic/react';

import * as tf from '@tensorflow/tfjs';
import * as poseNetModel from '@tensorflow-models/posenet';

import Webcam from "react-webcam";

import { useTranslation } from 'react-i18next';

import "./CurrentWorkout.css";

import { supabase } from '../services/supabaseClient';

interface exercise{
    workoutSessionId: string,
    workoutPlanId: string,
    user_id: string,
    duration: number,
    equipment: string,
    name: string,
    repetitions: string,
    sets: string,
    finished: boolean
}

interface Schedule{
    days_per_week: number,
    session_duration: number
}

interface workoutPlan{
    total_weeks: number,
    schedule: Schedule,
}

const CurrentWorkout: React.FC = () => {
    const { t } = useTranslation("CurrentWorkout");
    const router = useIonRouter();
    const { workoutPlanId, workoutId } = useParams<{ workoutPlanId: string, workoutId: string }>();
    const [ progress, setProgress ] = useState(0);
    const [ finishedWorkouts, setFinishedWorkouts ] = useState(0);
    const [ maxWorkouts, setMaxWorkouts ] = useState(0);
    const [ time, setTime ] = useState(0);
    const [ finished, setFinished ] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ workoutsDone, setWorkoutsDone ] = useState(0);

    const [ workoutPlanData, setWorkoutPlanData ] = useState<workoutPlan | null>(null);

    const [ exercises, setExercises ] = useState<exercise[] | null>(null);
    const [ currentExerciseId, setCurrentExerciseId ] = useState(0);

    const modelSetup = async () => {
        const model = await poseNetModel.load({
            inputResolution: { width: 560., height: 420 },
            architecture: 'MobileNetV1',
            outputStride: 16
        })

        setInterval(() => {
            poseDetection(model);
        }, 100);
    }

    const poseDetection = async (model: poseNetModel.PoseNet) => {
        if(webcamRef !== null && webcamRef.current !== null && model !== null && webcamRef.current.video !== null){
            const video = webcamRef.current.video;

            webcamRef.current.video.height = webcamRef.current.video?.videoHeight;
            webcamRef.current.video.width = webcamRef.current.video?.videoWidth;

            const detection = await model.estimateSinglePose(video);
            console.log(detection);
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
                    
            setUserId(userData.user.id);

            const { data: workoutsData, error: workoutsDataError } = await supabase
            .from("workouts")
            .select("workoutFinished")
            .eq("workoutPlan_id", workoutPlanId)
            .eq("user_id", userData.user.id)
            .single();

            if(workoutsDataError){
                console.log(workoutsDataError);
                setMessage("Workout not found!");
                return;
            }

            setWorkoutsDone(workoutsData.workoutFinished);
            
            const { data: workoutData, error: workoutDataError } = await supabase
            .from("workout")
            .select("workoutSessionId, workoutPlanId, user_id, duration, equipment, name, repetitions, sets, finished")
            .eq("workoutSessionId", workoutId)
            .eq("workoutPlanId", workoutPlanId)
            .eq("user_id", userData.user.id)

            if(workoutDataError){
                console.log(workoutDataError);
                setMessage("Workout not found!");
                return;
            }

            setExercises(workoutData);

            const { data: workoutPlanData, error: workoutPlanDataError } = await supabase
            .from("workoutPlans")
            .select("plan")
            .eq("id", workoutPlanId)
            .eq("user_id", userData.user.id)
            .single();
            
            if(workoutPlanDataError){
                console.log(workoutPlanDataError);
                setMessage("Workout plan not found!");
                return;
            }

            setWorkoutPlanData(workoutPlanData.plan);
            setMaxWorkouts(workoutPlanData.plan.schedule.days_per_week);
        }
            
        modelSetup();
        fetchUserData();
        modelSetup();
    }, []);

    const handleWorkoutChange = async (currentExerciseId: number) => {
        if(finishedWorkouts !== maxWorkouts - 3){
            setFinishedWorkouts(finishedWorkouts + 1);
            console.log(finishedWorkouts);
            setCurrentExerciseId(currentExerciseId + 1);
        } else{
            setFinished(true);
        }
    }

    const finishingWorkout = async () => {
        const { error: closingWorkoutError } = await supabase
        .from("workouts")
        .update({
            finished: true,
            workoutFinished: workoutsDone + 1
        })
        .eq("user_id", userId)

        if(closingWorkoutError){
            console.log(closingWorkoutError);
            setMessage("Error during closing the workout!");
            return;
        }
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref={`/currentWorkout/:${workoutPlanId}`}/>
                    <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                {finishedWorkouts < maxWorkouts && (
                    <div>
                        <div className='model'>
                            <Webcam
                            ref={webcamRef}>
                            </Webcam>
                        </div>

                        <div>
                            {exercises && !finished ? (
                                <div>
                                    <p>Name: {exercises[currentExerciseId].name}</p>
                                    <p>Duration: {exercises[currentExerciseId].duration}</p>
                                    <p>Required equipment: {exercises[currentExerciseId].equipment}</p>
                                    <p>Repetitions: {exercises[currentExerciseId].repetitions}</p>
                                    <p>Sets: {exercises[currentExerciseId].sets}</p>

                                <p>Model response: </p>

                                    <IonButton onClick={() => handleWorkoutChange(currentExerciseId)}>Next workout</IonButton>
                                </div>
                            ) : (
                                <IonButton onClick={() => finishingWorkout()} routerLink="/dashboard" routerDirection='root'>Finish workout</IonButton>
                            )}

                            
                        </div>
                    </div>
                )}

                {finishedWorkouts === maxWorkouts && (
                    <div>
                        <p>You finished your workout!</p>
                        <IonButton onClick={finishingWorkout}>Back to my workout plan</IonButton>
                    </div>
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

export default CurrentWorkout;