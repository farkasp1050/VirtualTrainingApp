import axios from 'axios';

export const fetchFoodData = async (classifyResult) => {
    try{
        const dataResult = axios.get(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
                {
                    params: {
                        api_key: import.meta.env.REACT_APP_USDA_API_KEY,
                        query: classifyResult,
                        pageSize: 1
                    }
                }
        );

        return dataResult;
    } catch(error){
        console.error('Error while fetching the data: ', error);
        throw error;
    }
};

export const fetchMealPlanData = async (calories) => {
    try{
        const dataResult = axios.get(
            "https://api.spoonacular.com/mealplanner/generate",
            {
                params: {
                    api_key: import.meta.env.REACT_APP_SPOONACULAR_API_KEY,
                    timeFrame: "day",
                    targetCalories: {calories}
                }
            }
        )
        return dataResult;
    } catch(error){
        console.error('Error while fetching the data: ', error);
        throw error;
    }
};