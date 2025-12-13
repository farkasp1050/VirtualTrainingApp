import { IonContent, IonHeader, IonItem, IonLabel, IonToast, IonCard, IonCardTitle, IonCardContent, IonAlert, IonList, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonInput, IonAvatar, IonIcon, IonPage, IonButton, IonButtons, IonBackButton, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { checkmark, accessibilitySharp, pizzaSharp, chatbubbleEllipsesSharp, chatboxEllipsesSharp } from "ionicons/icons";

import defaultAvatar from "../../assets/avatar.jpg";

import { useTranslation } from 'react-i18next';

import styles from "./Profile.module.css";

import '../../decideBadge.js';
import { decideFoodBadge, decideForumBadge, decideFriendBadge, decideReplyBadge } from '../../decideBadge.js';

interface ProfileData{
    email: String,
    fullName: String,
    Age: Number,
    Weight: Number,
    Height: Number,
    Gender: String,
    profilePicture: string,
    Goal: number,
    Diet: string
}

interface Friendship{
    id: string,
    created_at: string,
    firstUser: string,
    secondUser: string,
    hasChat: boolean
}

interface friend{
    id: string,
    fullName: string,
    profilePicture: string
}

const Profile: React.FC = () => {
    const { t } = useTranslation("Profile");
    const router = useIonRouter();
    const [ age, setAge ] = useState<number | null>(null);
    const [ gender, setGender ] = useState("");
    const [ weight, setWeight ] = useState<number | null>(null);
    const [ height, setHeight ] = useState<number | null>(null);
    const [ goal, setGoal ] = useState<number | null>(null);
    const [ diet, setDiet ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ profileData, setProfileData ] = useState<ProfileData>();
    const [ profilePictureFullPath, setProfilePictureFullPath ] = useState("");
    const [ profilePicture, setProfilePicture ] = useState("");
    const [ userId, setUserId ] = useState("");
    const [ postBadge, setPostBadge ] = useState(false);
    const [ friendsBadge, setFriendsBadge ] = useState(false);
    const [ replyBadge, setReplyBadge ] = useState(false);
    const [ foodBadge, setFoodBadge ] = useState(false);
    const [ friendshipData, setFriendshipData ] = useState<Friendship[]>([]);
    const [ friendsUserData, setFriendsUserData ] = useState<friend[]>([]);

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
            .select("email, fullName, Age, Weight, Height, Gender, profilePicture, Goal, Diet")
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
                setGoal(profileData.Goal);
                setDiet(profileData.Diet);
            }

            const relativeUrl = userData.user.id + "/avatar.png";

            const { data } = supabase.storage
            .from("profile-pictures")
            .getPublicUrl(relativeUrl)

            setProfilePictureFullPath(data.publicUrl);

            const { data: badgesData, error: badgesError } = await supabase
            .from("badges")
            .select("post, friends, postReply, addedFood")
            .eq("user_id", userData.user.id)
            .single();

            if(badgesError){
                console.log(badgesError);
                setMessage(`Something went wrong while fetching the badge data! ${badgesError?.message}`);
                return;
            }

            const foodBadgeResult = await decideFoodBadge(badgesData.addedFood);
            const friendBadgeResult = await decideFriendBadge(badgesData.friends);
            const forumBadgeResult = await decideForumBadge(badgesData.post);
            const replyBadgeResult = await decideReplyBadge(badgesData.postReply);

            setFoodBadge(foodBadgeResult);
            setFriendsBadge(friendBadgeResult);
            setPostBadge(forumBadgeResult);
            setReplyBadge(replyBadgeResult);

            const { data: friendshipData, error: friendshipDataError } = await supabase
            .from("friendships")
            .select("id, created_at, firstUser, secondUser, hasChat")
            .or(`firstUser.eq.${userData.user.id},secondUser.eq.${userData.user.id}`);

            if(friendshipDataError){
                console.log(friendshipDataError);
                setMessage(`Something went wrong while fetching the friendship data! ${friendshipDataError?.message}`);
                return;
            }

            setFriendshipData(friendshipData);

           const friendsIds = friendshipData.map((friendship) => {
                return friendship.firstUser === userId ? friendship.secondUser : friendship.firstUser;
           });

           const { data: friendsData, error: friendsDataError } = await supabase
           .from("users")
           .select("id, fullName, profilePicture")
           .in("id", friendsIds);

           if(friendsDataError){
                console.log(friendsDataError);
                setMessage(`Something went wrong while fetching the friends data! ${friendsDataError?.message}`);
                return;
           }

           setFriendsUserData(friendsData);
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
            Gender: gender,
            Goal: goal,
            Diet: diet
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

    const showBadgeTextFriends = async () => {
        setMessage("Earned for adding friends.");
        setShowToast(true);
    }

    const showBadgeTextFoods = async () => {
        setMessage("Earned for saving foods.");
        setShowToast(true);
    }

    const showBadgeTextPosts = async () => {
        setMessage("Earned for creating posts.");
        setShowToast(true);
    }

    const showBadgeTextReplies = async () => {
        setMessage("Earned for creating comments.");
        setShowToast(true);
    }

    return (
        <IonPage className={styles.page}>
            <IonHeader className={styles.header}>
                <IonButtons>
                    <IonBackButton className={styles.backButton} defaultHref='/dashboard'/>
                    <IonTitle className={styles.title}>{t("title")}</IonTitle>
                    <IonButtons onClick={handleProfileUpdate}>
                        <IonButton><IonIcon className={styles.checkMark} icon={checkmark} size='large'></IonIcon></IonButton>
                    </IonButtons>
                </IonButtons>
            </IonHeader>
            <IonContent className={styles.content}>
                <div className={styles.listContainer}>
                    <div className={styles.avatarContainer}>
                        <IonAvatar className={styles.avatar}>
                            <img src={defaultAvatar} alt="User Profile Picture" className={styles.image}/>
                        </IonAvatar>
                    </div>
                    <div className={styles.badgeContainer}>
                        {friendsBadge && (
                            <IonIcon icon={accessibilitySharp} onClick={showBadgeTextFriends} className={styles.icon}/>
                        )}
                        
                        {foodBadge && (
                            <IonIcon icon={pizzaSharp} onClick={showBadgeTextFoods} className={styles.icon}/>
                        )}
                        
                        {postBadge && (
                            <IonIcon icon={chatbubbleEllipsesSharp} onClick={showBadgeTextPosts} className={styles.icon}/>
                        )}
                        
                        {replyBadge && (
                            <IonIcon icon={chatboxEllipsesSharp} onClick={showBadgeTextReplies} className={styles.icon}/>
                        )}
                    </div>
                    <IonList className={styles.list}>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("fullName")} value={String(profileData?.fullName)} type='text' labelPlacement='floating' fill='outline' disabled placeholder={t("namePlaceholder")}></IonInput>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("email")} value={String(profileData?.email)} type='email' labelPlacement='floating' fill='outline' disabled placeholder={t("emailPlaceholder")}></IonInput>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("Age")} value={age} onIonChange={(e) => setAge(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("weight")} value={weight} onIonChange={(e) => setWeight(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("height")} value={height} onIonChange={(e) => setHeight(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                        </IonItem>
                        <IonSelect className={styles.listItem} label={t("gender")} value={gender} onIonChange={(e) => setGender(String(e.detail.value))} labelPlacement='floating'>
                            <IonSelectOption value="male">{t("male")}</IonSelectOption>
                            <IonSelectOption value="female">{t("female")}</IonSelectOption>
                        </IonSelect>
                        <IonItem className={styles.listItem}>
                            <input className={styles.listInput} type="file" accept='image/*' onChange={(e) => {handlePictureUpload(e)}}/>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("calorieGoal")} value={goal} onIonChange={(e) => setGoal(Number(e.detail.value))} type='number' labelPlacement='floating' fill='outline' placeholder='123'></IonInput>
                        </IonItem>
                        <IonItem className={styles.listItem}>
                            <IonInput className={styles.listInput} label={t("diet")} type='text' value={diet} onIonChange={(e) => setDiet(String(e.detail.value))} labelPlacement='floating' fill='outline' placeholder='Diet Type'></IonInput>
                        </IonItem>
                        <IonGrid className={styles.grid}>
                            <IonRow className={styles.gridRow}>
                                <IonCol className={styles.gridCol} size='12'>
                                    <IonButton id='triggerDeletion' color={'primary'} shape='round' expand='block'>
                                        {t("deleteAccount")}
                                        <IonAlert
                                        trigger='triggerDeletion'
                                        header='Are you sure?'
                                        buttons={[
                                            {
                                                text: t("cancel")
                                            },
                                            {
                                                text: t("deleteAccount"),
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
                </div>
                {friendshipData.map((friendship) => {
                    const friendId = friendship.firstUser === userId ? friendship.secondUser : friendship.firstUser;
                    console.log(friendId);
                    console.log(friendsUserData);

                    if (!friendId) {
                        return null;
                    }

                    return (
                        <div key={friendship.id} className={styles.friendshipContainer}>
                            <IonItem className={styles.friendshipItem}>
                                <IonAvatar className={styles.friendshipAvatar}>
                                    <img src={defaultAvatar} alt="User's profile picture" className={styles.friendshipImage}/>
                                </IonAvatar>
                                <IonLabel className={styles.friendshipLabel}>{t("name")}: {friendsUserData.find((f) => String(f.id) === String(friendId))?.fullName}</IonLabel>
                                <IonLabel className={styles.friendshipLabel}>{t("friendsSince")}: {new Date(friendship.created_at).toLocaleString()}</IonLabel>
                                <IonLabel className={styles.friendshipLabel}>{friendship.hasChat ? "Has chat" : "No chat"}</IonLabel>
                            </IonItem>
                        </div>
                    )
                })}
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