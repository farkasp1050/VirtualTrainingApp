import { IonContent, IonHeader, IonFab, IonToast, IonAlert, IonItemDivider, IonRow, IonCol, IonIcon, IonFabButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons, IonList, IonInput, IonItem, IonBackButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { add } from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';
import { send } from 'ionicons/icons';

import "./Forum.css";

import { useTranslation } from 'react-i18next';

import { incrementForumPostReply, incrementForumPost } from '../badges';

const Forum: React.FC = () => {
    const { t } = useTranslation("Forum");
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
    const [ userPostCounter, setUserPostCounter ] = useState(0);
    const [ userCommentCounter, setUserCommentCounter ] = useState(0);
 
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

    useEffect(() => {
        if (!userId) { return; }
        const fetchUserPostNumber = async () => {
            const { count, error: userPostNumberError } = await supabase
            .from("forumPosts")
            .select("*", { count: 'exact', head: true})
            .eq("author_id", userId);

            if(userPostNumberError){
                console.log(userPostNumberError);
                setMessage("Something went wrong while fetching the posts data!");
                setShowToast(true);
                return;
            }

            setUserPostCounter(count ?? 0);
        }

        const fetchUserCommentNumber = async () => {
            const { count, error: userCommentNumberError } = await supabase
            .from("forumComments")
            .select("*", { count: 'exact', head: true})
            .eq("author_id", userId);

            if(userCommentNumberError){
                console.log(userCommentNumberError);
                setMessage("Something went wrong while fetching the comments data!");
                setShowToast(true);
                return;
            }

            setUserCommentCounter(count ?? 0);
        }
        
        fetchUserCommentNumber();
        fetchUserPostNumber();
    }, []);

    const updateMilestoneForPost = async (userId: string) => {
            if( !userId ){ return; }
            const currentFriendNumber = await incrementForumPost(userPostCounter, userId);
            if(currentFriendNumber === 5){
                setMessage("New badge earned! You are famous now!");
                setShowToast(true);
            }
    
            setUserPostCounter(currentFriendNumber);
        }

    const updateMilestoneForReply = async (userId: string) => {
        if( !userId ){ return; }
        const currentCommentNumber = await incrementForumPostReply(userCommentCounter, userId);
        if(currentCommentNumber === 10){
            setMessage("New badge earned! You are a real commenter now!");
            setShowToast(true);
        }
    
        setUserCommentCounter(currentCommentNumber);
    }

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
        
        updateMilestoneForPost(userId);
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

        updateMilestoneForReply(userId);
        setMessage("Comment saved successfully!");
        setCommentDesc("");
        fetchForumComments();
    }

    return (
        <IonPage className='page'>
            <IonHeader>
                <IonButtons>
                    <IonBackButton className='backButton' defaultHref='/dashboard' />
                    <IonTitle className='ion-text-end'>{t("title")}</IonTitle>
                </IonButtons>
            </IonHeader>
            
            { loading ? (
                <IonContent className='page-content'>
                    <p>{t("loading")}</p>
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
                                name: t("name"),
                                type: "text",
                                disabled: true,
                                value: String(authorName),
                            },
                            {
                                name: t("createdAt"),
                                type: "datetime-local",
                                disabled: true,
                                value: new Date().toISOString().slice(0, 16),
                            },
                            {
                                name: t("description"),
                                type: "text",
                                disabled: false,
                                placeholder: t("placeholderDesc")
                            },
                        ]}
                        buttons={[
                            {
                                text: t("cancel"),
                                role: 'cancel',
                            },
                            {
                                text: t("save"),
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
                            <IonCardSubtitle className='forumSub'>{new Date(post.created_at).toLocaleString()}</IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent className='forumContent'>{post.description}</IonCardContent>
                            {comments.map((comment) => (
                                comment.forumPost_id === post.id ? (
                                    <IonCard className='forumComment' key={comment.id} color="primary">
                                        <IonCardHeader className='commentHeader' style={{ display: "flex", justifyContent: "space-between"}}>
                                            <IonCardSubtitle>{comment.authorName}</IonCardSubtitle>
                                            <IonCardSubtitle>{new Date(comment.created_at).toLocaleString()}</IonCardSubtitle>
                                        </IonCardHeader>

                                        <IonCardContent className='commentContent'>{comment.description}</IonCardContent>
                                    </IonCard>
                                ) : null
                            ))}
                            <IonItem className='writeComment'>
                                <IonIcon aria-hidden='true' icon={send} className='sendCommentButton' slot='end' onClick={() => handleCommentSubmit(post.id)}></IonIcon>
                                <IonInput label='Write a comment' value={commentDesc} onIonChange={e => setCommentDesc(String(e.detail.value))} type='text' labelPlacement='floating' fill='outline'  required placeholder={t("commentText")}></IonInput>
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