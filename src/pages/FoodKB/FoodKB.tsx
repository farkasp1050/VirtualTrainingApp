import { IonContent, IonBackButton, IonGrid, IonAlert,  IonList, IonItem, IonInput, IonButton, IonIcon, IonRow, IonToast, IonCol, IonButtons, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { trash, create, add, checkmark, trashBin } from 'ionicons/icons';

import styles from "./FoodKB.module.css";

import { useTranslation } from 'react-i18next';

import "react-datepicker/dist/react-datepicker.css";

import { incrementFoodAdd } from '../../badges.js';

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

    const currentDate = new Date().toISOString().split("T")[0];
    const [ date, setDate ] = useState(currentDate);

    const fetchData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError){
                console.log(userError);
                setMessage("User not logged in!");
                setShowToast(true);
                return;
            }
            setUserId(userData.user.id);
            setLoading(false);
    }

    const fetchFoodData = async () => {
            const { data: foodData, error: foodError, count } = await supabase
            .from("foods")
            .select("id, created_at, quantity, foodName, fat, calorie, carbohydrate, protein", { count: 'exact' })
            .eq('user_id', userId)
            .eq('created_at', date)
            .order("created_at", { ascending: false });

            if(!foodData || foodError){
                console.log(foodError);
                setMessage("There is no food recorded for this user on this date!");
                setShowToast(true);
                return;
            }

            setSumFoodAdded(count ?? 0);
            setFoods(foodData);
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
        fetchFoodData();
    }, []);

    useEffect(() => {
        fetchFoodData();
    }, [date]);

    const startUpdateFood = async (foodId: string) => {
        const { data: getFoodData, error: getFoodError } = await supabase
        .from("foods")
        .select("quantity, foodName, calorie, fat, carbohydrate, protein")
        .eq("user_id", userId)
        .eq("id", foodId)
        .single();

        if(getFoodError){
            console.log(getFoodError);
            setMessage("There is no food recorded for this user here!");
            setShowToast(true);
            return;
        }

        setFoodName(getFoodData.foodName);
        setQuantity(getFoodData.quantity);
        setCalorie(getFoodData.calorie);
        setCarbohydrate(getFoodData.carbohydrate);
        setProtein(getFoodData.protein);
        setFat(getFoodData.fat);
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
            
        fetchFoodData();
        setMessage("Food updated successfully!");
        setUpdateProcess(false);
    }

        const deleteFood = async (id: string) => {
            const { error: deletionError } = await supabase
            .from("foods")
            .delete()
            .eq("id", id);

            if(deletionError){
                console.log(deletionError);
                setMessage(`Deleting food was not successful! ${deletionError?.message}`);
                return;
            }

            fetchFoodData();
            setMessage("Deleting food was successful!");
        }

        const addFood = async () => {
            setAddProcess(true);
        }

        const saveFood = async () => {
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

            fetchFoodData();
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

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/dashboard' />
                    <IonTitle className={styles.title}>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                { loading ? (
                    <p className={styles.loading}>{t("loading")}</p>
                ) : (
                    <div className={styles.contentContainer}>
                        <input className={styles.input} type="date" onChange={(e) => setDate(e.target.value)} placeholder='---Please select an option---'/>
                        <div className={styles.gridContainer}>
                            <IonGrid className={styles.grid}>
                                <IonRow className={styles.headerRow}>
                                    <IonCol className={styles.gridcol}>{t("name")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("addedAt")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("quantity")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("fat")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("calorie")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("carbohydrate")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("protein")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("update")}</IonCol>
                                    <IonCol className={styles.gridcol}>{t("delete")}</IonCol>
                                </IonRow>
                            
                            {foods.map((food) => (
                                <IonRow key={food.id} className={styles.dataRow}>
                                    <IonCol className={styles.gridcol}>{food.foodName}</IonCol>
                                    <IonCol className={styles.gridcol}>{new Date(food.created_at).toLocaleString().slice(0, 13)}</IonCol>
                                    <IonCol className={styles.gridcol}>{food.quantity}</IonCol>
                                    <IonCol className={styles.gridcol}>{food.fat}</IonCol>
                                    <IonCol className={styles.gridcol}>{food.calorie}</IonCol>
                                    <IonCol className={styles.gridcol}>{food.carbohydrate}</IonCol>
                                    <IonCol className={styles.gridcol}>{food.protein}</IonCol>
                                    <IonCol className={styles.gridcol}><IonButton className={styles.button} onClick={() => { startUpdateFood(food.id), setFoodId(food.id) }}><IonIcon className={styles.icon} icon={create}/></IonButton>
                                    </IonCol>
                                    <IonCol><IonButton id='triggerDeletion' className={styles.button}><IonIcon className={styles.icon} icon={trash}/>
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

                <div className={styles.sumDataContainer}>
                    <p className={styles.sumData}>{t("dailyQuantity")}: {foods.reduce((sum, current) => sum = sum + current.quantity, 0)}</p>
                    <p className={styles.sumData}>{t("dailyCalorie")}: {foods.reduce((sum, current) => sum = sum + current.calorie, 0)}</p>
                    <p className={styles.sumData}>{t("dailyFat")}: {foods.reduce((sum, current) => sum = sum + current.fat, 0)}</p>
                    <p className={styles.sumData}>{t("dailyProtein")}: {foods.reduce((sum, current) => sum = sum + current.protein, 0)}</p>
                    <p className={styles.sumData}>{t("dailyCarbohydrate")}: {foods.reduce((sum, current) => sum = sum + current.carbohydrate, 0)}</p>
                </div>

                <IonButton className={styles.button} onClick={addFood}><IonIcon icon={add} className={styles.icon}></IonIcon></IonButton>
                {updateProcess &&(
                    <div className={styles.modifyContainer}>
                        <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Name' value={foodName} type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder={t("placeholderName")}></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Quantity' value={quantity} type='number' min="1" max="100" onIonChange={(e) => setQuantity(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='12'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Fat' value={fat} type='number' onIonChange={(e) => setFat(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Calorie' value={calorie} type='number' onIonChange={(e) => setCalorie(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Carbohydrate' value={carbohydrate} type='number' onIonChange={(e) => setCarbohydrate(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Protein' value={protein} type='number' onIonChange={(e) => setProtein(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                        <IonCol className={styles.listButtons}><IonButton className={styles.button} onClick={() => { updateFood(foodId) }}><IonIcon icon={checkmark}/></IonButton></IonCol>
                        <IonCol className={styles.listButtons}><IonButton className={styles.button} onClick={cancelUpdateFood}><IonIcon icon={trashBin}/></IonButton></IonCol>
                    </div>
                )}
                {addProcess &&(
                    <div className={styles.modifyContainer}>
                        <IonList className={styles.list}>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Food Name' type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder={t("placeholderName")}></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Quantity' value={quantity} type='number' min="1" max="100" onIonChange={(e) => setQuantity(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='12'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Fat' value={fat} type='number' onIonChange={(e) => setFat(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Calorie' value={calorie} type='number' onIonChange={(e) => setCalorie(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Carbohydrate' value={carbohydrate} type='number' onIonChange={(e) => setCarbohydrate(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                            <IonItem className={styles.listItem}>
                                <IonInput className={styles.listInput} label='Protein' value={protein} type='number' onIonChange={(e) => setProtein(Number(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                            </IonItem>
                        </IonList>
                        <IonCol className={styles.listButtons}><IonButton className={styles.button} onClick={saveFood}><IonIcon icon={checkmark}/></IonButton></IonCol>
                        <IonCol className={styles.listButtons}><IonButton className={styles.button} onClick={cancelSaveFood}><IonIcon icon={trashBin}/></IonButton></IonCol>
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