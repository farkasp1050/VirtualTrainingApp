import { data } from '@tensorflow/tfjs';
import axios from 'axios';

export const fetchFoodData = async (classifyResult) => {
    console.log("Getting food data starts here");
    try{
        const dataResult = await axios.get(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
                {
                    params: {
                        api_key: import.meta.env.VITE_USDA_API_KEY,
                        query: classifyResult,
                        pageSize: 1
                    }
                }
        );

        console.log("Sending back food data here");
        return dataResult;
    } catch(error){
        console.error('Error while fetching the data: ', error);
        throw error;
    }
};

export const fetchMealPlanData = async (goal, diet) => {
    console.log(goal);
    console.log(diet);
    try{
        const dataResult = await axios.get(
            "https://api.spoonacular.com/mealplanner/generate",
            {
                params: {
                    apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
                    timeFrame: "week",
                    targetCalories: goal,
                    diet: diet
                }
            }
        )
        return dataResult;
    } catch(error){
        console.error('Error while fetching the data: ', error);
        throw error;
    }
};

export const fetchWorkoutPlanData = async (fitnessGoal, fitnessLevel, preferences, healthConditions, daysPerWeek, sessionDuration, planDuration) => {
    const schedule = {
        days_per_week: daysPerWeek,
        session_duration: sessionDuration,
    };

    console.log(fitnessGoal, fitnessLevel, preferences, healthConditions, daysPerWeek, sessionDuration, planDuration, schedule);

    try{
        const dataResult = await axios.post(
            "https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan",
            {
                goal: fitnessGoal,
                fitness_level: fitnessLevel,
                preferences: preferences,
                health_conditions: healthConditions,
                schedule: schedule,
                plan_duration_weeks: planDuration,
                lang: "en"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Host': import.meta.env.VITE_X_RAPID_API_HOST,
                    'X-RapidAPI-Key': import.meta.env.VITE_X_RAPID_API_KEY
                }
            }
        )
        return dataResult;
    } catch(error){
        console.error('Error while fetching the data: ', error);
        throw error;
    }
};