import { IonContent, IonHeader, IonPage, IonList, IonText, IonAvatar, IonLabel, IonCard, IonItem, IonIcon, IonToast, IonButtons, IonBackButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { search, personAdd, personRemove, chatbubbleEllipses } from 'ionicons/icons';

import "./AddFriends.css";
import { incrementFriends } from '../badges';

import defaultAvatar from "../assets/avatar.jpg";

interface UserData{
    id: string
    created_at: string
    fullName: string
    Age: number
}

const addFriends: React.FC = () => {
    const [ searchParam, setSearchParam ] = useState("");
    const [ searchResult, setSearchResult ] = useState<UserData[]>([]);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ currentUserId, setCurrentUserId ] = useState("");
    const [ currentFriendCounter, setCurrentFriendCounter ] = useState(0);

    useEffect (() => {
        const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if(!userData || userError){
                console.log(userError);
                setMessage(`User not found! ${userError?.message}`);
                return;
            }

            setCurrentUserId(userData.user.id);

            const { count, error: friendshipDataError } = await supabase
            .from("friendships")
            .select("*", { count: 'exact', head: true })
            .or(`firstUser.eq.${userData.user.id},secondUser.eq.${userData.user.id}`);
            
            if(friendshipDataError){
                console.log(friendshipDataError);
                setMessage("Error while fetching the current user's friendship data!");
                setShowToast(true);
                return;
            }

            setCurrentFriendCounter(count ?? 0);
        }

        fetchUserData();
    }, []);

    const updateMilestone = async (userId: string) => {
        if( !currentUserId ){ return; }
        const currentFriendNumber = await incrementFriends(currentFriendCounter, userId);
        if(currentFriendNumber === 5){
            setMessage("New badge earned! You are famous now!");
            setShowToast(true);
        }

        setCurrentFriendCounter(currentFriendNumber);
    }

    const handleSearch = async () => {
        const { data: searchData, error: searchError } = await supabase
        .from('users')
        .select("id, created_at, fullName, Age")
        .eq("fullName", searchParam)

        if(searchError){
            console.log(searchError);
            setMessage("Error while searching for users!");
            setShowToast(true);
            return;
        }

        setSearchResult(searchData);
    }

    const handleAddFriend = async (param: any) => {
        const { error: friendshipDataError } = await supabase
        .from("friendships")
        .insert({
            firstUser: currentUserId,
            secondUser: param
        })

        if(friendshipDataError){
            console.log(friendshipDataError);
            setMessage("Error while adding the user as a friend!");
            setShowToast(true);
            return;
        }

        updateMilestone(currentUserId);
        setMessage("User added as a friend!");
        setShowToast(true);
    }

    const handleCreateChat = async (param: any) => {
        const { error: friendshipUpdateError } = await supabase
        .from("friendships")
        .update({
            hasChat: true
        })
        .or(`and(firstUser.eq.${currentUserId},secondUser.eq.${param}),and(firstUser.eq.${param},secondUser.eq.${currentUserId})`);

        if(friendshipUpdateError){
            console.log(friendshipUpdateError);
            setMessage("Error while updating the friendship status!");
            setShowToast(true);
            return;
        }

        setMessage("Conversation created successfully!");
        setShowToast(true);
    }

    const handleRemoveFriend = async (param: any) => {
        const { error: deletionError } = await supabase
        .from("friendships")
        .delete()
        .or(`and(firstUser.eq.${currentUserId},secondUser.eq.${param}),and(firstUser.eq.${param},secondUser.eq.${currentUserId})`);

        if(deletionError){
            console.log(deletionError);
            setMessage("Error while removing the user from your friends!");
            setShowToast(true);
            return;
        }

        setMessage("User removed from the friends!");
        setShowToast(true);
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard'/>
                    <input type='text' className='search-bar' value={searchParam} placeholder='John Doe' onChange={(e) => setSearchParam(String(e.target.value))}/>
                    <IonIcon className='search-icon' icon={search} size='large' onClick={(e) => { handleSearch(); }}></IonIcon>
                    <IonTitle className='ion-text-end'>Add Friends</IonTitle>
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen className="ion-padding page-content">
            {searchResult && (
                <IonList className='list'>
                    {searchResult.map((result) => (
                        <IonItem key={result.id} className='userCard'>
                            <div className='cardContent'>
                                <IonAvatar slot='start'>
                                <img src={defaultAvatar} alt="User Picture" className='profilePicture'/>
                                </IonAvatar>
                                <div className='userDetails'>
                                    <IonItem className='Name'>
                                        <IonLabel>Name: </IonLabel>
                                        <IonText>{result.fullName}</IonText>
                                    </IonItem>
                                    <IonItem className='Age'>
                                        <IonLabel>Age: </IonLabel>
                                        <IonText>{result.Age}</IonText>
                                    </IonItem>
                                    <IonItem className='Date'>
                                        <IonLabel>User created at: </IonLabel>
                                        <IonText>{new Date(result.created_at).toLocaleString()}</IonText>
                                    </IonItem>
                                    <IonItem>
                                        <IonIcon className='addIcon' icon={personAdd} slot='start' onClick={ () => { handleAddFriend(result.id) } }></IonIcon>
                                        <IonIcon className='removeIcon' icon={personRemove} onClick={ () => { handleRemoveFriend(result.id) } }></IonIcon>
                                        <IonIcon className='createChatIcon' icon={chatbubbleEllipses} slot='end' onClick={ () => { handleCreateChat(result.id) } }></IonIcon>
                                    </IonItem>
                                </div>
                            </div>
                        </IonItem>
                    ))}
                </IonList>
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

export default addFriends;