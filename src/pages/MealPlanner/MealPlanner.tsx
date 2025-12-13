import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonInput, IonButtons, IonBackButton, IonButton, IonIcon, IonToast, IonCol, IonRow, IonGrid } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { createSharp, closeCircleOutline, saveOutline } from 'ionicons/icons';

import { useTranslation } from 'react-i18next';
import { useIonRouter } from '@ionic/react';

import styles from "./MealPlanner.module.css";

import { fetchMealPlanData} from '../../api';
import { supabase } from '../../services/supabaseClient';

interface Meals{
    id: number,
    imageUrl: string,
    imageType: string,
    readyIn: number,
    servings: number,
    sourceUrl: string,
    title: string
}

interface Nutrient{
    calorie: number,
    carbohydrates: number,
    fat: number,
    protein: number
}

interface Day{
    foods: Meals[];
    nutrients: Nutrient;
}

interface GeneratedMealPlan{
    day: Day;
}

const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
const foodType = [ "Breakfast", "Lunch", "Dinner" ];


const MealPlanner: React.FC = () => {
    const { t } = useTranslation("MealPlanner");
    const router = useIonRouter();
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ generatedPlan, setGeneratedPlan ] = useState<GeneratedMealPlan | null>(null);
    const [ existingPlan, setExistingPlan ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ goal, setGoal ] = useState(0);
    const [ diet, setDiet ] = useState("");
    const [ createPhase, setCreatePhase ] = useState(false);
    const [ currentMealPlan, setCurrentMealPlan ] = useState<GeneratedMealPlan | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }
            
            setUserId(userData.user.id);

            const { data: userPersonalData, error: userPersonalError } = await supabase
            .from("users")
            .select("Goal, Diet")
            .eq("id", userData.user.id)
            .single()

            if(userPersonalError){
                console.log(userPersonalError);
                setMessage(`User personal data not found! ${userPersonalError?.message}`);
                return;
            }

            setGoal(userPersonalData.Goal);
            setDiet(userPersonalData.Diet);

            const { data: mealPlanData, error: mealPlanDataError } = await supabase
            .from("mealPlans")
            .select("plan")
            .eq("user_id", userData.user.id)
            .single()

            if(!mealPlanData){
                return;
            }

            if(mealPlanDataError){
                console.log(mealPlanDataError);
                setMessage("Something went wrong while fetching the current meal plan's details!");
                return;
            }

            setCurrentMealPlan(mealPlanData.plan);
            setExistingPlan(true);
        }

        fetchUserData();
    }, []);

    const createMealPlan = async () => {
        setCreatePhase(true);
        fetchMealPlanData(goal, diet)
            .then(data => {
                setGeneratedPlan(data.data.week);
                setExistingPlan(true);
            })
            .catch(err => {
                console.error(err);
                setMessage("There was an error while fetching the meal plan.");
                setShowToast(true);
            })
    }

    const deleteMealPlan = async () => {
        const { error: deleteMealError } = await supabase
        .from("mealPlans")
        .delete()
        .eq("user_id", userId)

        if(deleteMealError){
            console.error(deleteMealError);
            setMessage("There was an error while deleting your meal plan.");
        }

        setMessage("Current meal plan deleted successfully!");
        setShowToast(true);
        setExistingPlan(false);
        setCreatePhase(false);
        router.push('/dashboard');
    }

    const saveMealPlan = async () => {
        const { error: generatedMealPlanError } = await supabase
        .from("mealPlans")
        .insert({
            user_id: userId,
            planActive: true,
            plan: generatedPlan
        })

        if(generatedMealPlanError){
            console.error(generatedMealPlanError);
            setMessage("There was an error while saving your meal plan.");
            setShowToast(true);
        }

        setMessage("Your meal plan has been saved successfully!");
        setExistingPlan(true);
        setCreatePhase(false);
        router.push('/dashboard')
    }

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/dashboard' />
                        <IonTitle className={styles.title}>{t("title")}</IonTitle>
                    </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                {!existingPlan && (
                    <IonItem className={styles.createButtonContainer}>
                        <IonButton className={styles.createButton} onClick={createMealPlan}><IonIcon icon={createSharp}/>{t("createPlan")}</IonButton>
                    </IonItem>
                )}
                <div>
                    {existingPlan ? (

                        <div className={styles.dataContainer}>
                            <div className={styles.contentContainer}>
                                {generatedPlan && Object.entries(generatedPlan).map(([key, day], index) => {
                                    return (
                                        <div key={key} className={styles.planContainer}>
                                            <p className={styles.day}>{days[index]}</p>
                                            {day.meals.map((food: Meals, index: number) => (
                                                <div className={styles.planDataContainer} key={index}>
                                                    <p className={styles.planDataType}>{foodType[index]}</p>
                                                    <p className={styles.planData}>{t("name")}: {food.title}</p>
                                                    <p className={styles.planData}>{t("readyIn")}: {food.readyIn}</p>
                                                    <p className={styles.planData}>{t("servings")}: {food.servings}</p>
                                                    <a href={food.sourceUrl} className={styles.planData}>{t("recipe")}</a>
                                                </div>
                                            ))}

                                            <div className={styles.planNutrientDataContainer}>
                                                {generatedPlan && Object.entries(day.nutrients).map(([nutrient, value], index) => (
                                                    <p className={styles.planNutrientData} key={index}>
                                                        {nutrient}: {Number(value)}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}

                                {currentMealPlan && Object.entries(currentMealPlan).map(([key, day], index) => {
                                    return (
                                        <div key={key} className={styles.planContainer}>
                                            <p className={styles.day}>{days[index]}</p>
                                            {day.meals.map((food: Meals, index: number) => (
                                                <div className={styles.planDataContainer} key={index}>
                                                    <p className={styles.planData}>{foodType[index]}</p>
                                                    <p className={styles.planData}>{t("name")}: {food.title}</p>
                                                    <p className={styles.planData}>{t("readyIn")}: {food.readyIn}</p>
                                                    <p className={styles.planData}>{t("servings")}: {food.servings}</p>
                                                    <a href={food.sourceUrl} className={styles.planData}>{t("recipe")}</a>
                                                </div>
                                            ))}

                                            {generatedPlan && Object.entries(day.nutrients).map(([nutrient, value], index) => (
                                                <p className={styles.planNutrientData} key={index}>
                                                    {nutrient}: {Number(value)}
                                                </p>
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                                <IonButton className={styles.button} onClick={deleteMealPlan}><IonIcon icon={closeCircleOutline}/>{t("deletePlan")}</IonButton>
                                {createPhase && (
                                    <IonButton className={styles.button} onClick={saveMealPlan}><IonIcon icon={saveOutline}/>{t("savePlan")}</IonButton>
                                )}
                        </div>
                    ) : (
                        <div className={styles.noMealDataContainer}>
                            <p className={styles.planData}>{t("noPlan")}</p>
                            <p className={styles.planData}>{t("dietType")}: {diet}</p>
                            <p className={styles.planData}>{t("calorieGoal")}: {goal}</p>
                        </div>
                    )}
                </div>
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

export default MealPlanner;