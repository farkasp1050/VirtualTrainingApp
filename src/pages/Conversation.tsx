import { IonContent, IonHeader, IonInput, IonToast, IonFooter, IonButton, IonPage, IonRouterLink, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { supabase } from '../services/supabaseClient';

interface Friendship{
    id: string,
    created_at: string,
    firstUser: string,
    secondUser: string,
    hasChat: boolean
}

interface Message{
    id: string,
    friendshipId: string,
    authorId: string,
    created_at: string,
    author: string,
    messageValue: string
}

const Conversation: React.FC = () => {
    const { friendshipId } = useParams<{ friendshipId: string }>();
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ currentFriendship, setCurrentFriendship ] = useState<Friendship>();
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [ currentUserName, setCurrentUserName ] = useState("");
    const [ currentUserId, setCurrentUserId ] = useState("");

    const fetchUserData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();

            if(userError){
                console.log(userError);
                setMessage("Error while fetching the user!");
                setShowToast(true);
                return;
            }

            setCurrentUserId(userData.user.id);

            const { data: currentUserData, error: currentUserDataError } = await supabase
            .from("users")
            .select("fullName")
            .eq("id", userData.user.id)
            .single();

            setCurrentUserName(currentUserData?.fullName);
        }

        const fetchFriendshipData = async () => {
            const { data: friendshipData, error: friendshipDataError } = await supabase
            .from("friendships")
            .select("id, created_at, firstUser, secondUser, hasChat")
            .eq("id", friendshipId)
            .single();

            if(friendshipDataError){
                console.log(friendshipDataError);
                setMessage("Error while fetching the current user's friendship data!");
                setShowToast(true);
                return;
            }

            setCurrentFriendship(friendshipData);
        }

        const fetchPrevMessages = async () => {
            const { data: messageData, error: messageError } = await supabase
            .from("chatMessages")
            .select("id, friendshipId, authorId, created_at, author, messageValue")
            .eq("friendshipId", friendshipId)
            .order("created_at", { ascending: true })

            if(messageError){
                console.log(messageError);
                setMessage("Error while fetching the messages!");
                setShowToast(true);
                return;
            }

            setMessages(messageData);
        }    

    useEffect(() =>  {
        fetchPrevMessages();
        fetchUserData();
        fetchFriendshipData();
    }, []);

    const handleMessageSend = async () => {
        const { error: messageUploadError } = await supabase
        .from("chatMessages")
        .insert({
            friendshipId: friendshipId,
            authorId: currentUserId,
            created_at: new Date().toISOString(),
            author: currentUserName,
            messageValue: newMessage
        });

        if(messageUploadError){
            console.log(messageUploadError);
            setMessage("Error while sending the message!");
            setShowToast(true);
            return;
        }

        fetchPrevMessages();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Current Chat</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className='justify-center, flex, items-center, rounded'>
                    <div className='p-4'>
                        <p>Signed in as {currentUserName}</p>
                    </div>
                    <div>
                        {messages.length === 0 ? (
                            <div>
                                No message history. Write something now!
                            </div>
                        ) : (
                            <div>
                                {messages.map((message) => {
                                    return (
                                        <div key={message.id}>
                                            <div>{message.author}</div>
                                            <div>{message.created_at}</div>
                                            <p>{message.messageValue}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <IonFooter>
                    <IonInput type='text' onIonChange={(e) => setNewMessage(String(e.detail.value))} placeholder='Type your message...'></IonInput>
                    <IonButton onClick={handleMessageSend}>Send</IonButton>
                </IonFooter>
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

export default Conversation;