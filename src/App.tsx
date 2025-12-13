import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Splash from './components/Splash';
import basicDataSplash from './components/BasicDataSplash';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import FoodRecognizer from './pages/FoodRecognizer/FoodRecognizer';
import FoodKB from './pages/FoodKB/FoodKB';
import MyChats from './pages/MyChats/MyChats';
import Forum from './pages/Forum/Forum';
import WorkoutGenerator from './pages/WorkoutGenerator/WorkoutGenerator';
import MyWorkoutPlans from './pages/MyWorkoutPlan/MyWorkoutPlans';
import addFriends from './pages/addFriends/AddFriends';
import Conversation from './pages/Conversation/Conversation';
import MealPlanner from './pages/MealPlanner/MealPlanner';
import CurrentWorkout from './pages/CurrentWorkout/CurrentWorkout';
import CurrentWorkoutPlan from './pages/CurrentWorkoutPlan/CurrentWorkoutPlan';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import './App.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route component={Login} path="/" exact></Route>
        <Route component={Login} path="/login" exact></Route>
        <Route component={Register} path="/register" exact></Route>
        <Route component={basicDataSplash} path="/basicDataSplash" exact></Route>
        <Route component={Dashboard} path="/Dashboard" exact></Route>
        <Route component={Settings} path="/Settings" exact></Route>
        <Route component={Profile} path="/Profile" exact></Route>
        <Route component={FoodRecognizer} path="/foodRecognizer" exact></Route>
        <Route component={FoodKB} path="/foodKB" exact></Route>
        <Route component={Forum} path="/forum" exact></Route>
        <Route component={MyChats} path="/myChats" exact></Route>
        <Route component={WorkoutGenerator} path="/workoutGenerator" exact></Route>
        <Route component={MyWorkoutPlans} path="/myWorkoutPlans" exact></Route>
        <Route component={addFriends} path="/addFriends" exact></Route>
        <Route component={Conversation} path="/conversation/:friendshipId" exact></Route>
        <Route component={MealPlanner} path="/mealPlanner" exact></Route>
        <Route component={CurrentWorkout} path="/currentWorkout/:workoutPlanId/:workoutId" exact></Route>
        <Route component={CurrentWorkoutPlan} path="/currentWorkoutPlan/:workoutPlanId" exact></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
