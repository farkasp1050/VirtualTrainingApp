import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonButtons, IonBackButton, IonButton, IonIcon, IonToast } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import { createSharp } from 'ionicons/icons';

import "./MealPlanner.css";
import { fetchMealPlanData } from '../api';

interface Meal{
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
    image: string;
};

interface mealPlan{
    meals: Meal[];
    nutrients: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
};

const MealPlanner: React.FC = () => {
    const [ mealResult, setMealResult ] = useState<mealPlan | null>(null);
    const [ calories, setCalories ] = useState<number>();
    const [ showToast, setShowToast ] = useState(false);
    const [ message, setMessage ] = useState('');

    const createMealPlan = async () => {
        fetchMealPlanData(calories)
            .then(data => {
                setMealResult(data.data);
            })
            .catch(err => {
                console.error(err);
                setMessage("There was an error while fetching the meal plan.");
                setShowToast(true);
            })
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                        <IonTitle className='ion-text-end'>Meal Planner</IonTitle>
                    </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                <IonItem>
                    <IonInput className='input' label='Calorie' value={calories} type='number' onIonChange={(e) => setCalories(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    <IonButton className='createMealPlan' color="primary" onClick={createMealPlan}><IonIcon icon={createSharp}/></IonButton>
                </IonItem>

                <div className='mealResult'>
                    {mealResult?.meals.map(meal => (
                        <div key={meal.id}>
                            <h1>{meal.title}</h1>

                            <h2>Required time: {meal.readyInMinutes}</h2>
                            <p>Servings: {meal.servings}</p>
                            
                            <p><a href={meal.sourceUrl} target='_blank'>Check it out here</a></p>
                        </div>
                    ))}

                    <div>
                        <h1>Daily Sum of nutrients</h1>
                        <p>Calorie: {mealResult?.nutrients.calories}</p>
                        <p>Carbohydrates: {mealResult?.nutrients.carbohydrates}</p>
                        <p>Fat: {mealResult?.nutrients.fat}</p>
                        <p>Protein: {mealResult?.nutrients.protein}</p>
                    </div>
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