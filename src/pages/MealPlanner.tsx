import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonInput, IonButtons, IonBackButton, IonButton, IonIcon, IonToast } from '@ionic/react';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { createSharp, closeCircleOutline, saveOutline } from 'ionicons/icons';

import { useTranslation } from 'react-i18next';
import { useIonRouter } from '@ionic/react';

import "./MealPlanner.css";

import { fetchMealPlanData} from '../api';
import { supabase } from '../services/supabaseClient';

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
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref='/dashboard' />
                        <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                    </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                {!existingPlan && (
                    <IonItem>
                        <IonButton className='createMealPlan' color="primary" onClick={createMealPlan}><IonIcon icon={createSharp}/>Create a new plan</IonButton>
                    </IonItem>
                )}
                <div>
                    {existingPlan ? (
                        <div className='outer-container'>
                            {generatedPlan && Object.entries(generatedPlan).map(([key, day], index) => {
                                return (
                                    <div key={key}>
                                        <p>{days[index]}</p>
                                        {day.meals.map((food: Meals, index: number) => (
                                            <div key={index}>
                                                <p>{foodType[index]}</p>
                                                <p>{food.title}</p>
                                                <p>{food.readyIn}</p>
                                                <p>{food.servings}</p>
                                                <a href={food.sourceUrl}>Check the recipe out here!</a>
                                            </div>
                                        ))}

                                        {generatedPlan && Object.entries(day.nutrients).map(([nutrient, value], index) => (
                                            <p key={index}>
                                                {nutrient}: {Number(value)}
                                            </p>
                                        ))}
                                    </div>
                                )
                            })}

                            {currentMealPlan && Object.entries(currentMealPlan).map(([key, day], index) => {
                                return (
                                    <div key={key}>
                                        <p>{days[index]}</p>
                                        {day.meals.map((food: Meals, index: number) => (
                                            <div key={index}>
                                                <p>{foodType[index]}</p>
                                                <p>{food.title}</p>
                                                <p>{food.readyIn}</p>
                                                <p>{food.servings}</p>
                                                <a href={food.sourceUrl}>Check the recipe out here!</a>
                                            </div>
                                        ))}

                                        {generatedPlan && Object.entries(day.nutrients).map(([nutrient, value], index) => (
                                            <p key={index}>
                                                {nutrient}: {Number(value)}
                                            </p>
                                        ))}
                                    </div>
                                )
                            })}
                            <IonButton color="primary" onClick={deleteMealPlan}><IonIcon icon={closeCircleOutline}/>Delete plan</IonButton>
                            {createPhase && (
                                <IonButton color="primary" onClick={saveMealPlan}><IonIcon icon={saveOutline}/>Save plan</IonButton>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>You dont have any meal plans yet. Create one now!</p>
                            <p>Diet Type: {diet}</p>
                            <p>Calorie goal: {goal}</p>
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