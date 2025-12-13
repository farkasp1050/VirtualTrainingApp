export const decideFriendBadge = async (milestoneValue) => {
    if(milestoneValue >= 5){
        return true;
    }

    return false;
};

export const decideFoodBadge = async (milestoneValue) => {
    if(milestoneValue >= 10){
        return true;
    }

    return false;
};

export const decideForumBadge = async (milestoneValue) => {
    if(milestoneValue >= 5){
        return true;
    }

    return false;
};

export const decideReplyBadge = async (milestoneValue) => {
    if(milestoneValue >= 10){
        return true;
    }

    return false;
};