import { IonContent, IonHeader, IonPage, IonButton, IonIcon, IonToast, IonBackButton, IonItem, IonInput, IonButtons, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonText, IonSelect, IonSelectOption, IonLabel } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useIonRouter, IonCheckbox } from '@ionic/react';

import { createSharp, closeCircleOutline } from 'ionicons/icons';

import { v4 as uuidv4 } from "uuid";

import styles from "./WorkoutGenerator.module.css";

import { useTranslation } from 'react-i18next';

import { fetchWorkoutPlanData } from '../../api';
import { supabase } from '../../services/supabaseClient';

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

const WorkoutGenerator: React.FC = () => {
    const { t } = useTranslation("WorkoutGenerator");
    const router = useIonRouter();
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);

    const [ planMakeProcess, setPlanMakeProcess ] = useState(false);
    const [ isPlanGenerated, setIsPlanGenerated ] = useState(false);

    const [ generatedWorkoutPlan, setGeneratedWorkoutPlan ] = useState<WorkoutPlan | null>(null);
    const [ generatedWorkoutPlanId, setGeneratedWorkoutPlanId ] = useState("");
    const [ workoutdayId, setWorkoutDayId ] = useState("");

    const [ currentWorkoutPlan, setCurrentWorkoutPlan ] = useState<WorkoutPlan | null>(null);

    const [ currentUserId, setCurrentUserId ] = useState("");

    const preferenceOptions = [ "None", "Weight training", "Cardio" ];
    const healthConditionsOptions = [ "None", "Diabetes", "Asthma" ];

    const [ fitnessGoal, setFitnessGoal ] = useState("");
    const [ isFitnessGoalSet, setIsFitnessGoalSet ] = useState(false);
    const [ fitnessLevel, setFitnessLevel ] = useState("");
    const [ isFitnessLevelSet, setIsFitnessLevelSet ] = useState(false);
    const [ preferences, setPreferences ] = useState<string[]>([]);
    const [ isPreferencesSet, setIsPreferencesSet ] = useState(false);
    const [ healthConditions, setHealthConditions ] = useState<string[]>([]);
    const [ isHealthConditionsSet, setIsHealthConditionsSet ] = useState(false);
    const [ daysPerWeek, setDaysPerWeek ] = useState(0);
    const [ isDaysPerWeekSet, setIsDaysPerWeekSet ] = useState(false);
    const [ sessionDuration, setSessionDuration ] = useState(0);
    const [ isSessionDuration, setIsSessionDuration ] = useState(false);
    const [ planDuration, setPlanDuration ] = useState(0);
    const [ isPlanDurationSet, setIsPlanDurationSet ] = useState(false);
    const [ currentWorkoutPlanId, setCurrentWorkoutPlanId ] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
                    
            setCurrentUserId(userData.user.id);

            const { data: userWorkoutPlanData,  error: userWorkoutPlanDataError } = await supabase
            .from("workoutPlans")
            .select("id, plan")
            .eq("user_id", userData.user.id)
            .single();

            if(userWorkoutPlanDataError){
                console.log(userWorkoutPlanDataError);
                setMessage("Error while fetching the user's workout plan!");
                return;
            }

            if(!userWorkoutPlanData){
                return;
            }

            setCurrentWorkoutPlanId(userWorkoutPlanData.id);
            setCurrentWorkoutPlan(userWorkoutPlanData.plan);
        }

        fetchUserData();
    }, []);

    const handleCheckBoxStateForPreferences = async (label: any) => {
        const value = label.target.value;

        if(label.target.checked){
            setPreferences([...preferences, value]);
            setIsPreferencesSet(true);
        } else {
            setPreferences(preferences.filter(item => item !== value));
        }
    }

    const handleCheckBoxStateForHealth = async (label: any) => {
        const value = label.target.value;

        if(label.target.checked){
            setHealthConditions([...healthConditions, value]);
            setIsHealthConditionsSet(true);
        } else {
            setHealthConditions(healthConditions.filter(item => item !== value));
        }
    }

    const handleSavePlan = async () => {
        const workoutPlanId = uuidv4();
        setGeneratedWorkoutPlanId(workoutPlanId);

        const workoutDayId = uuidv4();
        setWorkoutDayId(workoutDayId);

        const { error: workoutPlanSaveError } = await supabase
        .from("workoutPlans")
        .insert({
            id: workoutPlanId,
            user_id: currentUserId,
            plan: generatedWorkoutPlan,
            maxWorkouts: daysPerWeek * planDuration,

        })

        if(workoutPlanSaveError){
            console.log(workoutPlanSaveError);
            setMessage(`Error while saving the workout plan! ${workoutPlanSaveError?.message}`);
            return;
        }

        const { error: workoutsSaveError } = await supabase
        .from("workouts")
        .insert({
            user_id: currentUserId,
            workoutPlan_id: workoutPlanId,
            exercise: generatedWorkoutPlan?.exercises,
            workoutFinished: 0,
        })

        if(workoutsSaveError){
            console.log(workoutsSaveError);
            setMessage(`Error while saving the workout plan! ${workoutsSaveError?.message}`);
            return;
        }

        const exercises = generatedWorkoutPlan?.exercises.flatMap((exercise, index) => 
            exercise.exercises.map((current)=> ({
                ...current,
                workoutSessionId: index,
                workoutPlanId: workoutPlanId,
                user_id: currentUserId,
                duration: current.duration,
                equipment: current.equipment,
                name: current.name,
                repetitions: current.repetitions,
                sets: current.sets
            }))
        );

        const { error: workoutSaveError } = await supabase
        .from("workout")
        .insert(exercises)

        if(workoutSaveError){
            console.log(workoutSaveError);
            setMessage(`Error while saving the workout plan! ${workoutSaveError?.message}`);
            return;
        }

        setMessage("Workout plan has been created successfully!");
        setShowToast(true);
        setPlanMakeProcess(false);
        setIsPlanGenerated(true);
        setGeneratedWorkoutPlan(null);
    }

    const handleDeleteWorkoutPlan = async () => {
        const { error: exerciseDeleteError } = await supabase
        .from("workout")
        .delete()
        .eq("user_id", currentUserId)
        .eq("workoutPlanId", currentWorkoutPlanId)

        if(exerciseDeleteError){
            console.log(exerciseDeleteError);
            setMessage(`Error while deleting the current workout plan! ${exerciseDeleteError?.message}`);
            return;
        }

        const { error: workoutDeleteError } = await supabase
        .from("workouts")
        .delete()
        .eq("user_id", currentUserId)
        .eq("workoutPlan_id", currentWorkoutPlanId)

        if(workoutDeleteError){
            console.log(workoutDeleteError);
            setMessage(`Error while deleting the current workout plan! ${workoutDeleteError?.message}`);
            return;
        }

        const { error: workoutPlanDeleteError } = await supabase
        .from("workoutPlans")
        .delete()
        .eq("user_id", currentUserId)
        .eq("id", currentWorkoutPlanId)

        if(workoutPlanDeleteError){
            console.log(workoutPlanDeleteError);
            setMessage(`Error while deleting the current workout plan! ${workoutPlanDeleteError?.message}`);
            return;
        }

        setMessage("Current workout plan deleted successfully!");
        setShowToast(true);
        setCurrentWorkoutPlan(null);
        router.push('/dashboard');
    }

    const handleAbortPlan = async () => {
        setPlanMakeProcess(false);
        setIsPlanGenerated(false);
        setFitnessGoal("");
        setIsFitnessGoalSet(false);
        setFitnessLevel("");
        setIsFitnessLevelSet(false);
        setPreferences([]);
        setIsPreferencesSet(false);
        setHealthConditions([]);
        setIsHealthConditionsSet(false);
        setDaysPerWeek(0);
        setIsDaysPerWeekSet(false);
        setSessionDuration(0);
        setIsSessionDuration(false);
        setPlanDuration(0);
        setIsPlanDurationSet(false);
        router.push('/dashboard');
    }

    const handleCreatePlan = async () => {
        console.log(fitnessGoal, fitnessLevel, preferences, healthConditions, daysPerWeek, sessionDuration, planDuration);
        fetchWorkoutPlanData(fitnessGoal, fitnessLevel, preferences, healthConditions, daysPerWeek, sessionDuration, planDuration)
            .then(data => {
                setGeneratedWorkoutPlan(data.data.result);
                setIsPlanGenerated(true);
                setPlanMakeProcess(false);
                console.log(data.data.result);
            })
            .catch(err => {
                console.error(err);
                setMessage("There was an error while fetching the workout plan.");
                setShowToast(true);
            })
    }

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/dashboard'/>
                    <IonTitle className={styles.title}>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                {!currentWorkoutPlan && !planMakeProcess && (
                    <IonItem className={styles.createButtonContainer}>
                        <IonButton className={styles.button} onClick={() => setPlanMakeProcess(true)}><IonIcon icon={createSharp}/>Create a new workout plan</IonButton>
                    </IonItem>
                )}
                
                {planMakeProcess && (
                    <IonGrid className={styles.grid}>
                        <IonRow className={styles.row}>
                            <IonCol className={styles.col} size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                                <IonText>
                                    <h2 className={styles.info}>{t("moreInfo")}</h2>
                                </IonText>
                                <IonItem className={styles.dataSection}>
                                        <IonSelect className={styles.input} label={t("fitnessGoal")} value={fitnessGoal} onIonChange={(e) => { setFitnessGoal(String(e.detail.value)); setIsFitnessGoalSet(true); }} labelPlacement='floating' placeholder='---Please choose an option---'>
                                            <IonSelectOption value="Build muscle">{t("muscle")}</IonSelectOption>
                                            <IonSelectOption value="Lose Weight">{t("loseWeight")}</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                    {isFitnessGoalSet && (
                                        <IonItem className={styles.dataSection}>
                                            
                                            <IonSelect className={styles.input} label={t("fitnessLevel")} value={fitnessLevel} onIonChange={(e) => { setFitnessLevel(String(e.detail.value)); setIsFitnessLevelSet(true); }} labelPlacement='floating' placeholder='---Please choose an option---'>
                                                <IonSelectOption value="Beginner">{t("beginner")}</IonSelectOption>
                                                <IonSelectOption value="Intermediate">{t("intermediate")}</IonSelectOption>
                                                <IonSelectOption value="Advanced">{t("advanced")}</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    )}
                    
                                    {isFitnessGoalSet && (
                                        preferenceOptions.map(preference => (
                                            <IonItem className={styles.dataSection} key={preference}>
                                                <IonLabel className={styles.data}>{preference}</IonLabel>
                                                <IonCheckbox className={styles.input} value={preference} checked={preferences.includes(preference)} onIonChange={(e) => { handleCheckBoxStateForPreferences(e)}} labelPlacement="end"/>
                                            </IonItem>
                                    )))}
                    
                                    {isFitnessGoalSet && (
                                        healthConditionsOptions.map(condition => (
                                            <IonItem className={styles.dataSection} key={condition}>
                                                <IonLabel className={styles.data}>{condition}</IonLabel>
                                                <IonCheckbox className={styles.input} value={condition} checked={healthConditions.includes(condition)} onIonChange={(e) => { handleCheckBoxStateForHealth(e)}} labelPlacement="end"/>
                                            </IonItem>
                                    )))}
                    
                                    {isFitnessGoalSet && (
                                        <IonItem className={styles.dataSection}>
                                            
                                            <IonInput className={styles.input} label={t("workoutFrequency")} value={daysPerWeek} onIonChange={e => { setDaysPerWeek(Number(e.detail.value)); setIsDaysPerWeekSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}

                                    {isDaysPerWeekSet && (
                                        <IonItem className={styles.dataSection}>
                                            
                                            <IonInput className={styles.input} label={t("sessionDuration")} value={sessionDuration} onIonChange={e => { setSessionDuration(Number(e.detail.value)); setIsSessionDuration(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}
                    
                                    {isSessionDuration && (
                                        <IonItem className={styles.dataSection}>
                                            
                                            <IonInput className={styles.input} label={t("planDuration")} value={planDuration} onIonChange={e => { setPlanDuration(Number(e.detail.value)); setIsPlanDurationSet(true); }} type='number' labelPlacement='floating' fill='outline'  required placeholder="123"></IonInput>
                                        </IonItem>
                                    )}
                    
                                    {isPlanDurationSet && (
                                        <div className={styles.dataSection}>
                                            <IonButton className={styles.button} onClick={() => handleCreatePlan()} shape='round'>{t("create")}</IonButton>
                                            <IonButton className={styles.button} onClick={() => handleAbortPlan()} shape='round'>{t("cancel")}</IonButton>
                                        </div>
                                    )}
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                )}

                {isPlanGenerated && generatedWorkoutPlan !== null &&(
                    <div className={styles.dataContainer}>
                        <h2 className={styles.data}>{generatedWorkoutPlan.goal}</h2>
                            <h3 className={styles.data}>{t("fitnessLevel")}: {generatedWorkoutPlan.fitness_level}</h3>
                                <div className={styles.dataSection}>
                                    <h4 className={styles.data}>{t("workoutDays")}: {generatedWorkoutPlan.schedule.days_per_week}</h4>
                                    <h4 className={styles.data}>{t("sessionDuration")}: {generatedWorkoutPlan.schedule.session_duration}</h4>
                                </div>

                                <div className={styles.dataSection}>
                                    {generatedWorkoutPlan?.exercises?.map((exercise, exerciseIndex) => (
                                        <div key={exerciseIndex}>
                                            <h3 className={styles.data}>{exercise.day}</h3>
                                            {exercise?.exercises?.map((currentData, index) => (
                                                <div className={styles.dataSection} key={index}>
                                                    <h4 className={styles.data}>{t("sessionDuration")}: {currentData.duration}</h4>
                                                    <h4 className={styles.data}>{t("equipment")}: {currentData.equipment}</h4>
                                                    <h4 className={styles.data}>{t("exerciseName")}: {currentData.name}</h4>
                                                    <h4 className={styles.data}>{t("rep")}: {currentData.repetitions}</h4>
                                                    <h4 className={styles.data}>{t("set")}: {currentData.sets}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className={styles.data}>{generatedWorkoutPlan.seo_title}</p>
                                    <p className={styles.data}>{t("description")}: {generatedWorkoutPlan.seo_content}</p>
                                    <p className={styles.data}>{t("keywords")}: {generatedWorkoutPlan.seo_keywords}</p>
                                </div>

                                <div className={styles.dataSection}>
                                    <IonButton className={styles.button} onClick={() => handleSavePlan()} shape='round' routerDirection='root'>Save</IonButton>
                                    <IonButton className={styles.button} onClick={() => handleAbortPlan()} shape='round'>Cancel</IonButton>
                                </div>
                    </div>
                )}

                {currentWorkoutPlan &&(
                    <div className={styles.dataContainer}>
                        <h2 className={styles.data}>{currentWorkoutPlan.goal}</h2>
                            <h3 className={styles.data}>{t("fitnessLevel")}: {currentWorkoutPlan.fitness_level}</h3>
                                <div className={styles.dataSection}>
                                    <h4 className={styles.data}>{t("workoutDays")}: {currentWorkoutPlan.schedule.days_per_week}</h4>
                                    <h4 className={styles.data}>{t("sessionDuration")}: {currentWorkoutPlan.schedule.session_duration}</h4>
                                </div>

                                <div className={styles.dataSection}>
                                    {currentWorkoutPlan?.exercises?.map((exercise, exerciseIndex) => (
                                        <div className={styles.cardMain} key={exerciseIndex}>
                                            <h3 className={styles.cardMainDay}>{exercise.day}</h3>
                                            {exercise?.exercises?.map((currentData, index) => (
                                                <div className={styles.dataSection} key={index}>
                                                    <h4 className={styles.data}>{t("sessionDuration")}: {currentData.duration}</h4>
                                                    <h4 className={styles.data}>{t("equipment")}: {currentData.equipment}</h4>
                                                    <h4 className={styles.data}>{t("exerciseName")}: {currentData.name}</h4>
                                                    <h4 className={styles.data}>{t("rep")}: {currentData.repetitions}</h4>
                                                    <h4 className={styles.data}>{t("set")}: {currentData.sets}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.dataSectionFooter}>
                                    <p className={styles.dataFooter}>{currentWorkoutPlan.seo_title}</p>
                                    <p className={styles.dataFooter}>{t("description")}: {currentWorkoutPlan.seo_content}</p>
                                    <p className={styles.dataFooter}>{t("keywords")}: {currentWorkoutPlan.seo_keywords}</p>
                                </div>

                                <div className={styles.deleteButton}>
                                    <IonButton className={styles.button} onClick={handleDeleteWorkoutPlan}><IonIcon icon={closeCircleOutline}/>Delete workout plan</IonButton>
                                </div>
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

export default WorkoutGenerator;