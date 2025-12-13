import { IonContent, IonHeader, IonToast, IonButton, IonButtons, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useRef } from 'react';
import { useIonRouter } from '@ionic/react';

import * as tf from '@tensorflow/tfjs';
import * as poseNetModel from '@tensorflow-models/posenet';
import { Capacitor } from '@capacitor/core';

import Webcam from "react-webcam";
import { Camera } from '@capacitor/camera';

import { useTranslation } from 'react-i18next';

import styles from "./CurrentWorkout.module.css";

import { supabase } from '../../services/supabaseClient';

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

    const [ rendered, setRendered ] = useState(false);

    const [ workoutPlanData, setWorkoutPlanData ] = useState<workoutPlan | null>(null);

    const [ exercises, setExercises ] = useState<exercise[] | null>(null);
    const [ currentExerciseId, setCurrentExerciseId ] = useState(0);

    const exercisesRef = useRef<exercise[] | null>(exercises);
    const currentExerciseIdRef = useRef<number>(currentExerciseId);
    const repCooldownRef = useRef(false);

    const [ currentRepsDone, setCurrentRepsDone ] = useState(0);
    const [ currentSetsDone, setCurrentSetsDone ] = useState(0);

    interface Position{
        x: number;
        y: number
    }

    interface Joint{
        position: Position,
        score: number,
        part: string
    }

    function calculatingJointAngle (joint1: Joint, joint2: Joint, joint3: Joint){
        const calculatedAngle = Math.atan2(joint3.position.y - joint1.position.y, joint3.position.x - joint1.position.x) - Math.atan2(joint2.position.y - joint1.position.y, joint2.position.x - joint1.position.x);

        const degree = Math.abs(calculatedAngle * (180 / Math.PI));

        if(degree > 180){
            console.log(360-degree);
            return 360 - degree;
        } else {
            console.log(degree);
            return degree;
        }
    }

    function repChecker(degree: number, max: number, min: number){
        let halfRep = false;

        if(degree <= min){
            halfRep = true;
        }

        if(halfRep && degree >= max && !repCooldownRef.current){
            halfRep = false;
            return true;
        }

        if(degree <= max){
            repCooldownRef.current = false;
        }

        return false;
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

        const cameraPermission = async () => {
            if(Capacitor.isNativePlatform()){
                const cameraPermission = await Camera.requestPermissions();
                if(cameraPermission.camera !== 'granted'){
                    return;
                }
            }

            setRendered(true);
        }
  
        cameraPermission();
        fetchUserData();
    }, []);

    useEffect(() => {
        if (!exercises || exercises.length === 0) return;

        const setupModel = async () => {
            const model = await poseNetModel.load({
                inputResolution: { width: 560, height: 420 },
                architecture: 'MobileNetV1',
                outputStride: 16
            });

            const intervalId = setInterval(() => {
                poseDetection(model);
            }, 300);

            return () => clearInterval(intervalId);
        };

        setupModel();
    }, [exercises]);

    useEffect(() => {
        exercisesRef.current = exercises;
    }, [exercises]);

    useEffect(() => {
        currentExerciseIdRef.current = currentExerciseId;
    }, [currentExerciseId]);

    const poseDetection = async (model: poseNetModel.PoseNet) => {
        if(webcamRef !== null && webcamRef.current !== null && model !== null && webcamRef.current.video !== null){
            const video = webcamRef.current.video;

            webcamRef.current.video.height = webcamRef.current.video?.videoHeight;
            webcamRef.current.video.width = webcamRef.current.video?.videoWidth;

            const detection = await model.estimateSinglePose(video);
            console.log(detection);

            if(detection.score > 0.3){
                if(exercisesRef.current && currentExerciseIdRef.current != null){
                    const currentExercise = exercisesRef.current[currentExerciseIdRef.current]?.name;
                    
                    if(currentExercise.toLowerCase().includes("squat")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[13], detection.keypoints[11], detection.keypoints[15]);
                        const fullRep = repChecker(degreeResult, 160, 140);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("plank")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[11], detection.keypoints[5], detection.keypoints[15]);
                        const fullRep = repChecker(degreeResult, 170, 180);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("bench press")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[7], detection.keypoints[5], detection.keypoints[9]);
                        const fullRep = repChecker(degreeResult, 120, 150);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("bent-over")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[7], detection.keypoints[5], detection.keypoints[9]);
                        const fullRep = repChecker(degreeResult, 120, 150);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("shoulder press")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[7], detection.keypoints[5], detection.keypoints[9]);
                        const fullRep = repChecker(degreeResult, 130, 160);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("deadlift")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[11], detection.keypoints[5], detection.keypoints[13]);
                        const fullRep = repChecker(degreeResult, 150, 170);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("pull-up")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[7], detection.keypoints[5], detection.keypoints[9]);
                        const fullRep = repChecker(degreeResult, 120, 150);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("jumping")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[5], detection.keypoints[7], detection.keypoints[9]);
                        const fullRep = repChecker(degreeResult, 160, 170);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                    else if(currentExercise.toLowerCase().includes("bicycle")){
                        const degreeResult = calculatingJointAngle(detection.keypoints[5], detection.keypoints[7], detection.keypoints[13]);
                        const fullRep = repChecker(degreeResult, 100, 150);
                        if(fullRep === true){
                            setCurrentRepsDone(currentRepsDone => currentRepsDone + 1);
                        }
                    }
                } else{
                    return;
                }
            }
        }
    }

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
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref={`/currentWorkout/:${workoutPlanId}`}/>
                    <IonTitle className={styles.title}>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                {finishedWorkouts < maxWorkouts && (
                    <div className={styles.container}>
                        <div className={styles.webcamContainer}>
                            <Webcam
                            ref={webcamRef} className={styles.webcam}>
                            </Webcam>
                        </div>
                        <div>
                            {exercises && !finished ? (
                                <div className={styles.resultContainer}>
                                    <p className={styles.data}>{t("name")}: {exercises[currentExerciseId].name}</p>
                                    <p className={styles.data}>{t("duration")}: {exercises[currentExerciseId].duration}</p>
                                    <p className={styles.data}>{t("equipment")}: {exercises[currentExerciseId].equipment}</p>
                                    <p className={styles.data}>{t("reps")}: {exercises[currentExerciseId].repetitions}</p>
                                    <p className={styles.data}>{t("sets")}: {exercises[currentExerciseId].sets}</p>

                                <h2 className={styles.data}>{t("repsCompleted")}: {currentRepsDone}</h2>

                                    <IonButton className={styles.button} onClick={() => handleWorkoutChange(currentExerciseId)}>{t("nextWorkout")}</IonButton>
                                </div>
                            ) : (
                                <div className={styles.finishContainer}>
                                    <IonButton className={styles.finishButton} onClick={() => finishingWorkout()} routerLink="/dashboard" routerDirection='root'>{t("finishWorkout")}</IonButton>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {finishedWorkouts === maxWorkouts && (
                    <div className={styles.resultContainer}>
                        <p className={styles.data}>{t("youFinishedWorkout")}</p>
                        <IonButton className={styles.button} onClick={finishingWorkout}>{t("backToPlan")}</IonButton>
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