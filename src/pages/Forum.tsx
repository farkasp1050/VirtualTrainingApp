import { IonContent, IonHeader, IonFab, IonToast, IonAlert, IonIcon, IonFabButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons, IonList, IonInput, IonItem, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { add } from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';

const Forum: React.FC = () => {
    const [ forumDesc, setForumDesc ] = useState("");
    const [ authorName, setAuthorName ] = useState("");
    const [ postDate, setPostDate ] = useState(Date);
    const [ posts, setPosts ] = useState<any[]>([]);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ loading, setLoading ] = useState(true);
 
    const fetchUserData = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if(userError){
            console.log(userError);
            setMessage("User not logged in!");
            setShowToast(true);
            return;
        }
        setUserId(userData.user.id);

        const { data: userMainData, error: userMainError } = await supabase
        .from("users")
        .select("fullName")
        .eq("id", userData.user.id)
        .single()
        
        if(userMainError){
            console.log(userMainError);
            setMessage("Something went wrong while fetching the user data!");
            setShowToast(true);
            return;
        }

        setAuthorName(userMainData.fullName);
    }

    const fetchForumPosts = async () => {
        const { data: forumData, error: forumError } = await supabase
        .from("forumPosts")
        .select("id, created_at, authorName, description")
        
        if(forumError){
            console.log(forumError);
            setMessage("Something went wrong while fetching the forum posts!");
            setShowToast(true);
            return;
        }

        setPosts(forumData);
        setLoading(false);
    }

    useEffect(() => {
        fetchUserData();
        fetchForumPosts();
    }, []);

    const handleAddPost = async (data: any) => {
        const { error: forumDataInsertError } = await supabase
        .from("forumPosts")
        .insert({
            created_at: data?.created_at,
            author_id: userId,
            authorName: data?.authorName,
            description: data?.description
        });

        if(forumDataInsertError){
            console.log(forumDataInsertError);
            setMessage("Something went wrong while saving your forum post!");
            setShowToast(true);
            return;
        }

        setMessage("Post saved successfully!");
        fetchForumPosts();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>Forum</IonTitle>
                </IonButtons>
            </IonHeader>
            
            { loading ? (
                <IonContent>
                    <p>Loading...</p>
                </IonContent>
            ) : (
            <IonContent className="ion-padding">
                <IonFab vertical='top' horizontal='end' slot='fixed'>
                <IonFabButton id='triggerPostSave' color="primary">
                    <IonIcon icon={add}/>
                    <IonAlert
                        trigger='triggerPostSave'
                        header='Create Post'
                        inputs={[
                            {
                                name: "authorName",
                                type: "text",
                                disabled: true,
                                value: String(authorName),
                            },
                            {
                                name: "created_at",
                                type: "datetime-local",
                                disabled: true,
                                value: new Date().toISOString().slice(0, 16),
                            },
                            {
                                name: "description",
                                type: "text",
                                disabled: false,
                                placeholder: "Post description"
                            },
                        ]}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                            },
                            {
                                text: 'Save',
                                role: 'confirm',
                                handler: (data) => {
                                    handleAddPost(data);
                                },
                            },
                        ]}
                    ></IonAlert>
                </IonFabButton>
                </IonFab>
                {posts.map((post) => (
                    <IonCard key={post.id}>
                        <IonCardHeader style={{ display: "flex", justifyContent: "space-between"}}>
                            <IonCardSubtitle>{post.authorName}</IonCardSubtitle>
                            <IonCardSubtitle>{post.created_at}</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>{post.description}</IonCardContent>
                    </IonCard>
                ))}
            </IonContent>
            )}
            <IonToast
                isOpen={showToast}
                message={message}
                duration={3000}
                onDidDismiss={() => setShowToast(false)}
            />
        </IonPage>
    );
};

export default Forum;