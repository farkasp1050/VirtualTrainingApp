import { IonContent, IonButtons, IonBackButton, IonCard, IonItem, IonAvatar, IonLabel, IonToast, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface userData{
    id: string,
    fullName: string,
    profilePicture: string
}

interface friendshipData{
    id: string,
    created_at: string,
    firstUser: string,
    secondUser: string,
    hasChat: boolean
}

interface chatsData{
    id: string,
    created_at: string,
    firstUser: string,
    secondUser: string
}

interface friend{
    id: string,
    fullName: string,
    profilePicture: string
}

const MyChats: React.FC = () => {
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ currentUserId, setCurrentUserId ] = useState("");
    const [ friendsUserData, setFriendsUserData ] = useState<friend[]>([]);
    const [ currentUserData, setCurrentUserData ] = useState<userData | null>(null);
    const [ friendshipData, setFriendshipData ] = useState<friendshipData[]>([]);
    const [ chatsData, setChatsData ] = useState<chatsData[]>([]);

    useEffect (() => {
        const fetchUserData = async () => {
            const { data: user, error: userError } = await supabase.auth.getUser();

            if(userError){
                console.log(userError);
                setMessage("Error while fetching the user!");
                setShowToast(true);
                return;
            }

            const { data: userData, error: userDataError } = await supabase
            .from("users")
            .select("id, fullName, profilePicture")
            .eq("id", user.user.id)
            .single();

            if(userDataError){
                console.log(userDataError);
                setMessage("Error while fetching the current user's data!");
                setShowToast(true);
                return;
            }

            setCurrentUserId(userData?.id);
            setCurrentUserData(userData);

            if (!currentUserId) return;

            const { data: friendshipData, error: friendshipDataError } = await supabase
            .from("friendships")
            .select("id, created_at, firstUser, secondUser, hasChat")
            .or(`firstUser.eq.${userData.id},secondUser.eq.${userData.id}`);

            if(friendshipDataError){
                console.log(friendshipDataError);
                setMessage("Error while fetching the current user's friendship data!");
                setShowToast(true);
                return;
            }

            setFriendshipData(friendshipData.filter(friendship => friendship.hasChat));

            console.log(friendshipData);

            const friendIds = friendshipData.map((friendship) => {
                return friendship.firstUser === currentUserId ? friendship.secondUser : friendship.firstUser;
            });

            console.log(friendIds);

            const { data: friendData, error: friendDataError } = await supabase
            .from("users")
            .select("id, fullName, profilePicture")
            .in("id", friendIds);

            if(friendDataError){
                console.log(friendshipDataError);
                setMessage("Error while fetching the current user's friends data!");
                setShowToast(true);
                return;
            }

            setFriendsUserData(friendData);
            
            const { data: chatsData, error: chatsDataError } = await supabase
            .from("chats")
            .select("id, created_at, firstUser, secondUser")
            .or(`firstUser.eq.${userData.id},secondUser.eq.${userData.id}`);

            if(chatsDataError){
                console.log(chatsDataError);
                setMessage("Error while fetching the current user's chat data!");
                setShowToast(true);
                return;
            }

            setChatsData(chatsData);
        }

        fetchUserData();
    }, [currentUserId]);

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>My Chats</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent className="ion-padding">
            {friendshipData.length === 0 ? (
                    <p>You have no active conversations yet!</p>
                ) : (
                    friendshipData.map((friendship) => {
                        const friendId = friendship.firstUser === currentUserId ? friendship.secondUser : friendship.firstUser;

                        console.log(friendsUserData);
                        console.log(friendId);

                        if (!friendsUserData.length || !friendId) {
                            return null;
                        }

                        const friend = friendsUserData.find((f) => String(f.id) === String(friendId));

                        if(!friend) {
                            console.log("No available friends.");
                            return null;
                        }

                        return (
                            <div key={friendship.id}>
                                <IonItem routerLink={`/conversation/${friendship.id}`}>
                                    <IonAvatar></IonAvatar>
                                    <IonLabel>{friendsUserData.find((f) => String(f.id) === String(friendId))?.fullName}</IonLabel>
                                    <IonLabel>{friendsUserData.find((f) => String(f.id) === String(friendId))?.profilePicture}</IonLabel>
                                    <IonLabel>{chatsData.find((f) => String(f.id) === String(friendId))?.created_at}</IonLabel>
                                </IonItem>
                            </div>
                        )
                    })
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

export default MyChats;