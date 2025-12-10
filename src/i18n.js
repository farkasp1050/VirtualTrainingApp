import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAddFriends from "./translations/en/addFriends.json";
import enBasicDataSplash from "./translations/en/basicDataSplash.json";
import enConversation from "./translations/en/conversation.json";
import enCurrentWorkout from "./translations/en/currentWorkout.json";
import enCurrentWorkoutPlan from "./translations/en/currentWorkoutPlan.json";
import enDashboard from "./translations/en/dashboard.json";
import enFoodKB from "./translations/en/foodKB.json";
import enFoodRecognizer from "./translations/en/foodRecognizer.json";
import enForum from "./translations/en/forum.json";
import enLogin from "./translations/en/login.json";
import enMealPlanner from "./translations/en/mealPlanner.json";
import enMyChats from "./translations/en/myChats.json";
import enMyWorkouts from "./translations/en/myWorkouts.json";
import enProfile from "./translations/en/profile.json";
import enRegister from "./translations/en/register.json";
import enSettings from "./translations/en/settings.json";
import enSplash from "./translations/en/splash.json";
import enWorkoutGenerator from "./translations/en/workoutGenerator.json";

import huAddFriends from "./translations/hu/addFriends.json";
import huBasicDataSplash from "./translations/hu/basicDataSplash.json";
import huConversation from "./translations/hu/conversation.json";
import huCurrentWorkout from "./translations/hu/currentWorkout.json";
import huCurrentWorkoutPlan from "./translations/hu/currentWorkoutPlan.json";
import huDashboard from "./translations/hu/dashboard.json";
import huFoodKB from "./translations/hu/foodKB.json";
import huFoodRecognizer from "./translations/hu/foodRecognizer.json";
import huForum from "./translations/hu/forum.json";
import huLogin from "./translations/hu/login.json";
import huMealPlanner from "./translations/hu/mealPlanner.json";
import huMyChats from "./translations/hu/myChats.json";
import huMyWorkouts from "./translations/hu/myWorkouts.json";
import huProfile from "./translations/hu/profile.json";
import huRegister from "./translations/hu/register.json";
import huSettings from "./translations/hu/settings.json";
import huSplash from "./translations/hu/splash.json";
import huWorkoutGenerator from "./translations/hu/workoutGenerator.json";

const actualLanguage = localStorage.getItem("lang");

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                addFriends: enAddFriends,
                basicDataSplash: enBasicDataSplash,
                Conversation: enConversation,
                CurrentWorkout: enCurrentWorkout,
                CurrentWorkoutPlan: enCurrentWorkoutPlan,
                Dashboard: enDashboard,
                FoodKB: enFoodKB,
                FoodRecognizer: enFoodRecognizer,
                Forum: enForum,
                Login: enLogin,
                MealPlanner: enMealPlanner,
                MyChats: enMyChats,
                MyWorkouts: enMyWorkouts,
                Profile: enProfile,
                Register: enRegister,
                Settings: enSettings,
                Splash: enSplash,
                WorkoutGenerator: enWorkoutGenerator,
            },
            hu: {
                addFriends: huAddFriends,
                basicDataSplash: huBasicDataSplash,
                Conversation: huConversation,
                CurrentWorkout: huCurrentWorkout,
                CurrentWorkoutPlan: huCurrentWorkoutPlan,
                Dashboard: huDashboard,
                FoodKB: huFoodKB,
                FoodRecognizer: huFoodRecognizer,
                Forum: huForum,
                Login: huLogin,
                MealPlanner: huMealPlanner,
                MyChats: huMyChats,
                MyWorkouts: huMyWorkouts,
                Profile: huProfile,
                Register: huRegister,
                Settings: huSettings,
                Splash: huSplash,
                WorkoutGenerator: huWorkoutGenerator,
            },
        },
        lng: actualLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;