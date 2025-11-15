import { IonContent, IonHeader, IonItem, IonLabel, IonToast, IonCard, IonCardTitle, IonCardContent, IonAlert, IonList, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonInput, IonAvatar, IonIcon, IonPage, IonButton, IonButtons, IonBackButton, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { checkmark } from "ionicons/icons";

import defaultAvatar from "../assets/avatar.jpg";

import './Profile.css';

interface ProfileData{
    email: String,
    fullName: String,
    Age: Number,
    Weight: Number,
    Height: Number,
    Gender: String,
    profilePicture: string
}

const Profile: React.FC = () => {
    const router = useIonRouter();
    const [ age, setAge ] = useState<number | null>(null);
    const [ gender, setGender ] = useState("");
    const [ weight, setWeight ] = useState<number | null>(null);
    const [ height, setHeight ] = useState<number | null>(null);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ profileData, setProfileData ] = useState<ProfileData>();
    const [ profilePictureFullPath, setProfilePictureFullPath ] = useState("");
    const [ profilePicture, setProfilePicture ] = useState("");
    const [ userId, setUserId ] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }

            setUserId(userData.user.id);

            const { data: profileData, error: dataFetchError } = await supabase
            .from("users")
            .select("email, fullName, Age, Weight, Height, Gender, profilePicture")
            .eq("id", userData.user.id)
            .single();

            if(dataFetchError){
                console.log(dataFetchError);
                setMessage(`User not found! ${dataFetchError?.message}`);
                return;
            }

            if(profileData){
                setProfileData(profileData);
                setAge(profileData.Age);
                setGender(profileData.Gender);
                setWeight(profileData.Weight);
                setHeight(profileData.Height);
                setProfilePicture(profileData.profilePicture);
            }

            const relativeUrl = userData.user.id + "/avatar.png";

            const { data } = supabase.storage
            .from("profile-pictures")
            .getPublicUrl(relativeUrl)

            setProfilePictureFullPath(data.publicUrl);
        }

        fetchUserData();
    }, []);

    const handlePictureUpload = async (e: any) => {
        const newUrl = userId + "/avatar.png";

        const { data: pictureData, error: pictureError } = await supabase
        .storage
        .from('profile-pictures')
        .upload(newUrl, e.target.files[0], { upsert: true })

        if(pictureError){
            console.log(pictureError);
            setMessage("Error while updating profile picture!");
            setShowToast(true);
            return;
        }

        const { data: savedPicData} = await supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(newUrl);

        setProfilePictureFullPath(savedPicData.publicUrl + `?v=${Date.now()}`);

        const { data: newPictureData, error: newPictureError } = await supabase
        .from("users")
        .update({
            profilePicture: "/avatar.png"
        })
        .eq("id", userId);

        if(newPictureError){
            console.log(newPictureError);
            setMessage("Error while updating profile picture!");
            setShowToast(true);
            return;
        }

        setMessage("Profile Picture updated successfully!");
        setShowToast(true);
        router.push("/dashboard");
    }

    const handleProfileUpdate = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if(!userData || userError){
            console.log(userError);
            setMessage(`User not found! ${userError?.message}`);
            return;
        }

        const { error: updateError } = await supabase
        .from("users")
        .update({
            Age: age,
            Weight: weight,
            Height: height,
            Gender: gender
        })
        .eq("id", userData.user.id);

        if(updateError){
            console.log(updateError);
            setMessage(`User not found! ${updateError?.message}`);
            return;
        }

        setMessage("User updated successfully!");
        router.push("/dashboard");
    }

    const handleAccountDeletion = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if(!userData || userError){
            console.log(userError);
            setMessage(`User not found! ${userError?.message}`);
            return;
        }

        const { error: deletionError } = await supabase
        .from("users")
        .delete()
        .eq("id", userData.user.id);

        if(deletionError){
            console.log(deletionError);
            setMessage(`User not found! ${deletionError?.message}`);
            return;
        }

        setMessage("Account deletion was successful!");
        setShowToast(true);
        router.push("/login");
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <IonTitle className='ion-text-center'>Profile</IonTitle>
                    <IonButtons onClick={handleProfileUpdate}>
                        <IonButton><IonIcon icon={checkmark}></IonIcon></IonButton>
                    </IonButtons>
                </IonButtons>
                
            </IonHeader>
            <IonContent className="ion-padding ion-text-center page-content">
                <IonAvatar>
                    <img src={profilePictureFullPath || defaultAvatar} alt="User Profile Picture" />
                </IonAvatar>
                <IonList className='list'>
                    <IonItem>
                        <IonInput label='Full Name' value={String(profileData?.fullName)} type='text' labelPlacement='floating' fill='outline' disabled placeholder='John Doe'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Email' value={String(profileData?.email)} type='email' labelPlacement='floating' fill='outline' disabled placeholder='somebody@something.com'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Age' value={age} onIonChange={(e) => setAge(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Weight' value={weight} onIonChange={(e) => setWeight(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput label='Height' value={height} onIonChange={(e) => setHeight(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                    </IonItem>
                    <IonSelect label='Gender' value={gender} onIonChange={(e) => setGender(String(e.detail.value))} labelPlacement='floating'>
                        <IonSelectOption value="male">Male</IonSelectOption>
                        <IonSelectOption value="female">Female</IonSelectOption>
                    </IonSelect>
                    <IonItem>
                        <input type="file" accept='image/*' onChange={(e) => {handlePictureUpload(e)}}/>
                    </IonItem>
                    <IonGrid>
                        <IonRow>
                           <IonCol size='12'>
                                <IonButton id='triggerDeletion' color={'primary'} shape='round' className='ion-margin-top' expand='block'>
                                    Delete Account
                                    <IonAlert
                                    trigger='triggerDeletion'
                                    header='Are you sure?'
                                    buttons={[
                                        {
                                            text: 'Cancel'
                                        },
                                        {
                                            text: 'Delete Account',
                                            handler: () => {
                                                handleAccountDeletion();
                                            },
                                        },
                                    ]}
                                    ></IonAlert>
                                  <IonIcon style={{ marginLeft: "5px" }}></IonIcon>
                                  </IonButton>
                            </IonCol>
                         </IonRow>
                    </IonGrid>
                </IonList>
                <IonCard>
                    <IonCardContent className='friends'>
                        <IonItem className='friendsContent'>
                            <IonAvatar slot='middle'></IonAvatar>
                            <IonLabel>Friends Name Placeholder</IonLabel>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

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

export default Profile;