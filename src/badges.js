import { supabase } from "./services/supabaseClient";

export const incrementForumPost = async (actualPostNumber, userId) => {
    const { error }  = await supabase
    .from("badges")
    .update({
        post: actualPostNumber + 1
    })
    .eq("user_id", userId);

    if(error){
        console.log(error.message);
        throw error;
    }

    return actualPostNumber + 1;
};

export const incrementFriends = async (actualFriendNumber, userId) => {
    const { error }  = await supabase
    .from("badges")
    .update({
        friends: actualFriendNumber + 1
    })
    .eq("user_id", userId);

    if(error){
        console.log(error.message);
        throw error;
    }

    return actualFriendNumber + 1;
};

export const incrementForumPostReply = async (actualReplyNumber, userId) => {
    const { error }  = await supabase
    .from("badges")
    .update({
        postReply: actualReplyNumber + 1
    })
    .eq("user_id", userId);

    if(error){
        console.log(error.message);
        throw error;
    }

    return actualReplyNumber + 1;
};

export const incrementFoodAdd = async (actualFoodNumber, userId) => {
    const { error }  = await supabase
    .from("badges")
    .update({
        addedFood: actualFoodNumber + 1
    })
    .eq("user_id", userId);

    if(error){
        console.log(error.message);
        throw error;
    }

    return actualFoodNumber + 1;
};