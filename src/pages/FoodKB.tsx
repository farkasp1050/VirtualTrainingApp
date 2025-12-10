import { IonContent, IonBackButton, IonGrid, IonAlert,  IonList, IonItem, IonInput, IonButton, IonIcon, IonRow, IonToast, IonCol, IonButtons, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { trash, create, add, checkmark, trashBin } from 'ionicons/icons';

import { useTranslation } from 'react-i18next';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReactPaginate from 'react-paginate';

import { incrementFoodAdd } from '../badges.js';

const FoodKB: React.FC = () => {
    const { t } = useTranslation("FoodKB");
    const [ foods, setFoods ] = useState<any []>([]);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ addProcess, setAddProcess ] = useState(false);
    const [ updateProcess, setUpdateProcess ] = useState(false);
    const [ foodName, setFoodName ] = useState("");
    const [ fat, setFat ] = useState(0);
    const [ calorie, setCalorie ] = useState(0);
    const [ carbohydrate, setCarbohydrate ] = useState(0);
    const [ quantity, setQuantity ] = useState<number>(1);
    const [ protein, setProtein ] = useState(0);
    const [ userId, setUserId ] = useState("");
    const [ foodId, setFoodId ] = useState("");
    const [ sumFoodAdded, setSumFoodAdded ] = useState(0);

    const fetchData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError){
                console.log(userError);
                setMessage("User not logged in!");
                setShowToast(true);
                return;
            }
            setUserId(userData.user.id);

            const { data: foodData, error: foodError, count } = await supabase
            .from("foods")
            .select("id, created_at, quantity, foodName, fat, calorie, carbohydrate, protein", { count: 'exact' })
            .eq('user_id', userData.user.id)
            .order("created_at", { ascending: false });

            if(!foodData || foodError){
                console.log(foodError);
                setMessage("There is no food recorded for this user!");
                setShowToast(true);
                return;
            }

            setSumFoodAdded(count ?? 0);
            setFoods(foodData);
            setLoading(false);
    }
    const updateMilestone = async (userId: string) => {
        if( !userId ) return;
        const currentFoodNumber = await incrementFoodAdd(sumFoodAdded, userId);
        if(currentFoodNumber === 10){
            setMessage("New badge earned! You are looking out for your health now!");
            setShowToast(true);
        }
                          
        setSumFoodAdded(currentFoodNumber);
    }

    useEffect(() => {
            fetchData();
    }, []);

    const startUpdateFood = async () => {
        setUpdateProcess(true);
    }

    const updateFood = async (id: string) => {
        setMessage("");

        const { error: updateError } = await supabase
        .from("foods")
        .update({
            quantity: quantity,
            foodName: foodName,
            fat: fat,
            calorie: calorie,
            carbohydrate: carbohydrate,
            protein: protein
        })
        .eq("id", id);
            
        if(updateError){
            console.log(updateError);
            setMessage(`Updating food was not successful! ${updateError?.message}`);
            return;
        }
            
        fetchData();
        setMessage("Food updated successfully!");
        setUpdateProcess(false);
    }

        const deleteFood = async (id: string) => {
            setMessage("");
            const { error: deletionError } = await supabase
            .from("foods")
            .delete()
            .eq("id", id);

            if(deletionError){
                console.log(deletionError);
                setMessage(`Deleting food was not successful! ${deletionError?.message}`);
                return;
            }

            fetchData();
            setMessage("Deleting food was successful!");
        }

        const addFood = async () => {
            setAddProcess(true);
        }

        const saveFood = async () => {
            setMessage("");
            const { error: saveError } = await supabase
            .from("foods")
            .insert({
                user_id: userId,
                quantity: quantity,
                foodName: foodName,
                fat: fat,
                calorie: calorie,
                carbohydrate: carbohydrate,
                protein: protein
            });

            if(saveError){
                console.log(saveError);
                setMessage(`Saving food was not successful! ${saveError?.message}`);
                return;
            }

            fetchData();
            updateMilestone(userId);
            setMessage("Deleting food was successful!");
            setAddProcess(false);
        }

        const cancelUpdateFood = async () => {
            setUpdateProcess(false);
        }

        const cancelSaveFood = async () => {
            setFoodName("");
            setQuantity(0);
            setFat(0);
            setCarbohydrate(0);
            setProtein(0);
            setCalorie(0);
            setAddProcess(false);
        }

        const handlePageChange = async () => {
            
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
                { loading ? (
                    <p>{t("loading")}</p>
                ) : (
                    <div className='outerContainer'>
                        <div className='innerContainer'>
                            <IonGrid className='grid'>
                                <IonRow className='header'>
                                    <IonCol>{t("name")}</IonCol>
                                    <IonCol>{t("addedAt")}</IonCol>
                                    <IonCol>{t("quantity")}</IonCol>
                                    <IonCol>{t("fat")}</IonCol>
                                    <IonCol>{t("calorie")}</IonCol>
                                    <IonCol>{t("carbohydrate")}</IonCol>
                                    <IonCol>{t("protein")}</IonCol>
                                    <IonCol>{t("update")}</IonCol>
                                    <IonCol>{t("delete")}</IonCol>
                                </IonRow>
                            
                            {foods.map((food) => (
                                <IonRow key={food.id} className='dataRow'>
                                    <IonCol>{food.foodName}</IonCol>
                                    <IonCol>{new Date(food.created_at).toLocaleString()}</IonCol>
                                    <IonCol>{food.quantity}</IonCol>
                                    <IonCol>{food.fat}</IonCol>
                                    <IonCol>{food.calorie}</IonCol>
                                    <IonCol>{food.carbohydrate}</IonCol>
                                    <IonCol>{food.protein}</IonCol>
                                    <IonCol><IonButton color="primary" className='createButton' onClick={() => { startUpdateFood(), setFoodId(food.id) }}><IonIcon icon={create}/></IonButton>
                                    </IonCol>
                                    <IonCol><IonButton id='triggerDeletion' className='deleteButton' color="primary"><IonIcon icon={trash}/>
                                        <IonAlert
                                                trigger='triggerDeletion'
                                                header='Are you sure?'
                                                buttons={[
                                                            {
                                                                text: t("cancel"),
                                                                role: 'cancel',
                                                            },
                                                            {
                                                                text: t("deleteFood"),
                                                                role: 'confirm',
                                                                handler: () => {
                                                                    deleteFood(food.id);
                                                                },
                                                            },
                                                        ]}
                                            ></IonAlert>
                                    </IonButton></IonCol>
                                </IonRow>
                            ))}
                        </IonGrid>
                        </div>
                    </div>
                )}

                <div className='nutrients'>
                    <p>{t("dailyQuantity")}: {foods.reduce((sum, current) => sum = sum + current.quantity, 0)}</p>
                    <p>{t("dailyCalorie")}: {foods.reduce((sum, current) => sum = sum + current.calorie, 0)}</p>
                    <p>{t("dailyFat")}: {foods.reduce((sum, current) => sum = sum + current.fat, 0)}</p>
                    <p>{t("dailyProtein")}: {foods.reduce((sum, current) => sum = sum + current.protein, 0)}</p>
                    <p>{t("dailyCarbohydrate")}: {foods.reduce((sum, current) => sum = sum + current.carbohydrate, 0)}</p>
                </div>

                <IonButton color="primary" className='addButton' onClick={addFood}><IonIcon icon={add}></IonIcon></IonButton>
                {updateProcess &&(
                    <div className="ion-padding">
                        <IonList className='list'>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Name' value={foodName} type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder={t("placeholderName")}></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Quantity' value={quantity} type='number' min="1" max="100" onIonChange={(e) => setQuantity(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='12'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Fat' value={fat} type='number' onIonChange={(e) => setFat(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Calorie' value={calorie} type='number' onIonChange={(e) => setCalorie(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Carbohydrate' value={carbohydrate} type='number' onIonChange={(e) => setCarbohydrate(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Protein' value={protein} type='number' onIonChange={(e) => setProtein(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                        </IonList>
                        <IonCol><IonButton color="primary" className='updateButton' onClick={() => { updateFood(foodId) }}><IonIcon icon={checkmark}/></IonButton></IonCol>
                        <IonCol><IonButton color="primary" className='cancelButton' onClick={cancelUpdateFood}><IonIcon icon={trashBin}/></IonButton></IonCol>
                    </div>
                )}
                {addProcess &&(
                    <div className="ion-padding">
                        <IonList className='list'>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Food Name' type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder={t("placeholderName")}></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Quantity' value={quantity} type='number' min="1" max="100" onIonChange={(e) => setQuantity(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='12'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Fat' type='number' onIonChange={(e) => setFat(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Calorie' type='number' onIonChange={(e) => setCalorie(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Carbohydrate' type='number' onIonChange={(e) => setCarbohydrate(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Protein' type='number' onIonChange={(e) => setProtein(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                        </IonList>
                        <IonCol><IonButton color="primary" className='saveButton' onClick={saveFood}><IonIcon icon={checkmark}/></IonButton></IonCol>
                        <IonCol><IonButton color="primary" className='cancelButton' onClick={cancelSaveFood}><IonIcon icon={trashBin}/></IonButton></IonCol>
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

export default FoodKB;