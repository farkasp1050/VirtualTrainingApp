import { IonContent, IonHeader, IonFab, IonToast, IonAlert, IonItemDivider, IonRow, IonCol, IonIcon, IonFabButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons, IonList, IonInput, IonItem, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { add } from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';
import { send } from 'ionicons/icons';
import "./Forum.css";

const Forum: React.FC = () => {
    const [ forumDesc, setForumDesc ] = useState("");
    const [ authorName, setAuthorName ] = useState("");
    const [ postDate, setPostDate ] = useState(Date);
    const [ posts, setPosts ] = useState<any[]>([]);
    const [ message, setMessage ] = useState("");
    const [ showToast, setShowToast ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [ commentDesc, setCommentDesc ] = useState("");
    const [ comments, setComments ] = useState<any[]>([]);
 
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
    }

    const fetchForumComments = async () => {
        const { data: commentData, error: commentError } = await supabase
        .from("forumComments")
        .select("id, created_at, forumPost_id, authorName, description")

        if(commentError){
            console.log(commentError);
            setMessage("Something went wrong while fetching the forum comments!");
            setShowToast(true);
            return;
        }

        setComments(commentData);
        setLoading(false);
    }

    useEffect(() => {
        fetchUserData();
        fetchForumPosts();
        fetchForumComments();
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

    const handleCommentSubmit = async (data: any) => {
        const { error: commentDataInsertError } = await supabase
        .from("forumComments")
        .insert({
            created_at: new Date().toISOString().slice(0, 16),
            forumPost_id: data,
            author_id: userId,
            authorName: authorName,
            description: commentDesc
        });

        if(commentDataInsertError){
            console.log(commentDataInsertError);
            setMessage("Something went wrong while saving your forum comment!");
            setShowToast(true);
            return;
        }

        setMessage("Comment saved successfully!");
        setCommentDesc("");
        fetchForumComments();
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>Forum</IonTitle>
                </IonButtons>
            </IonHeader>
            
            { loading ? (
                <IonContent className='page-content'>
                    <p>Loading...</p>
                </IonContent>
            ) : (
            <IonContent className="ion-padding page-content">
                <IonFab vertical='top' horizontal='end' slot='fixed'>
                <IonFabButton id='triggerPostSave' color="primary" className='addPostButton'>
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
                    <IonCard key={post.id} className='forumPost'>
                        <IonCardHeader className='forumHeader' style={{ display: "flex", justifyContent: "space-between"}}>
                            <IonCardSubtitle className='forumSub'>{post.authorName}</IonCardSubtitle>
                            <IonCardSubtitle className='forumSub'>{post.created_at}</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent className='forumContent'>{post.description}</IonCardContent>
                            {comments.map((comment) => (
                                comment.forumPost_id === post.id ? (
                                    <IonCard className='forumComment' key={comment.id} color="primary">
                                        <IonCardHeader className='commentHeader' style={{ display: "flex", justifyContent: "space-between"}}>
                                            <IonCardSubtitle>{comment.authorName}</IonCardSubtitle>
                                            <IonCardSubtitle>{comment.created_at}</IonCardSubtitle>
                                        </IonCardHeader>

                                        <IonCardContent className='commentContent'>{comment.description}</IonCardContent>
                                    </IonCard>
                                ) : null
                            ))}
                            <IonItem className='writeComment'>
                                <IonIcon aria-hidden='true' icon={send} className='sendCommentButton' slot='end' onClick={() => handleCommentSubmit(post.id)}></IonIcon>
                                <IonInput label='Write a comment' value={commentDesc} onIonChange={e => setCommentDesc(String(e.detail.value))} type='text' labelPlacement='floating' fill='outline'  required placeholder='Text goes here!'></IonInput>
                            </IonItem>
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