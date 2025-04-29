export default {
    "request_rental": {
        error: "Rental could not be requested at this time. Please try again or contact customer service.",
        success: "Rental requested",
    },
    "update_user_profile": {
        error: "Could not update user profile. Please try again or contact customer service.",
        success: "User profile updated",
    }
} as Record<string, { error: string, success: string }>;
