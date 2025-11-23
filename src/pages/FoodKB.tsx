import { IonContent, IonBackButton, IonGrid, IonAlert,  IonList, IonItem, IonInput, IonButton, IonIcon, IonRow, IonToast, IonCol, IonButtons, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { trash, create, add, checkmark, trashBin } from 'ionicons/icons';
import "./FoodKB.css";

const FoodKB: React.FC = () => {
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
    const [ quantity, setQuantity ] = useState(1);
    const [ protein, setProtein ] = useState(0);
    const [ userId, setUserId ] = useState("");
    const [ foodId, setFoodId ] = useState("");

    const fetchData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError){
                console.log(userError);
                setMessage("User not logged in!");
                setShowToast(true);
                return;
            }
            setUserId(userData.user.id);

            const { data: foodData, error: foodError } = await supabase
            .from("foods")
            .select("id, quantity, foodName, fat, calorie, carbohydrate, protein")
            .eq('user_id', userData.user.id);

            if(!foodData || foodError){
                console.log(foodError);
                setMessage("There is no food recorded for this user!");
                setShowToast(true);
                return;
            }

            setFoods(foodData);
            setLoading(false);
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
            setMessage("Deleting food was successful!");
            setAddProcess(false);
        }

        const cancelUpdateFood = async () => {
            setUpdateProcess(false);
        }

        const cancelSaveFood = async () => {
            setFoodName("");
            setQuantity(1);
            setFat(0);
            setCarbohydrate(0);
            setProtein(0);
            setCalorie(0);
            setAddProcess(false);
        }
    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>FoodKB</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding page-content">
                { loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='outerContainer'>
                        <div className='innerContainer'>
                            <IonGrid className='grid'>
                                <IonRow className='header'>
                                    <IonCol>Name</IonCol>
                                    <IonCol>Quantity</IonCol>
                                    <IonCol>Fat</IonCol>
                                    <IonCol>Calorie</IonCol>
                                    <IonCol>Carbohydrate</IonCol>
                                    <IonCol>Protein</IonCol>
                                    <IonCol>Update</IonCol>
                                    <IonCol>Delete</IonCol>
                                </IonRow>
                            
                            {foods.map((food) => (
                                <IonRow key={food.id} className='dataRow'>
                                    <IonCol>{food.foodName}</IonCol>
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
                                                                text: 'Cancel',
                                                                role: 'cancel',
                                                            },
                                                            {
                                                                text: 'Delete Food',
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
                <IonButton color="primary" className='addButton' onClick={addFood}><IonIcon icon={add}></IonIcon></IonButton>
                {updateProcess &&(
                    <div className="ion-padding">
                        <IonList className='list'>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Name' value={foodName} type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='Apple'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Quantity' value={quantity} type='number' min={1} max={100} onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='Apple'></IonInput>
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
                                <IonInput label='Food Name' type='text' onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='Apple'></IonInput>
                            </IonItem>
                            <IonItem className="ion-padding-top">
                                <IonInput label='Quantity' value={quantity} type='number' min={1} max={100} onIonChange={(e) => setFoodName(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='Apple'></IonInput>
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