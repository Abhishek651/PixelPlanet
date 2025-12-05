// ============================================
// ERROR MESSAGE UTILITY
// Converts technical errors to user-friendly messages
// ============================================

/**
 * Get user-friendly error message from error object
 * @param {Error|Object} error - Error object or API error response
 * @param {string} context - Context where error occurred (e.g., 'login', 'challenge')
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyError = (error, context = 'general') => {
    // Handle network errors
    if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
    }

    // Handle Firebase Auth errors
    if (error.code) {
        return getFirebaseErrorMessage(error.code);
    }

    // Handle API errors with message
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        // Check for common error patterns
        if (error.message.includes('ECONNREFUSED') || error.message.includes('Network Error')) {
            return 'Unable to connect to server. Please try again later.';
        }
        
        if (error.message.includes('timeout')) {
            return 'Request timed out. Please check your connection and try again.';
        }

        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            return 'Your session has expired. Please log in again.';
        }

        if (error.message.includes('403') || error.message.includes('Forbidden')) {
            return 'You don\'t have permission to perform this action.';
        }

        if (error.message.includes('404') || error.message.includes('Not Found')) {
            return getNotFoundMessage(context);
        }

        if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
            return 'Server error occurred. Please try again later.';
        }
    }

    // Context-specific fallback messages
    return getContextualErrorMessage(context);
};

/**
 * Get Firebase Auth error messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getFirebaseErrorMessage = (errorCode) => {
    const errorMessages = {
        // Authentication errors
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
        'auth/invalid-credential': 'Invalid login credentials. Please check and try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
        'auth/requires-recent-login': 'Please log out and log in again to perform this action.',
        
        // Token errors
        'auth/invalid-id-token': 'Your session has expired. Please log in again.',
        'auth/id-token-expired': 'Your session has expired. Please log in again.',
        'auth/id-token-revoked': 'Your session has been revoked. Please log in again.',
    };

    return errorMessages[errorCode] || 'An authentication error occurred. Please try again.';
};

/**
 * Get context-specific not found messages
 * @param {string} context - Context where error occurred
 * @returns {string} User-friendly error message
 */
const getNotFoundMessage = (context) => {
    const notFoundMessages = {
        'challenge': 'Challenge not found. It may have been deleted.',
        'user': 'User not found.',
        'institute': 'Institute not found.',
        'submission': 'Submission not found.',
        'quiz': 'Quiz not found.',
        'general': 'The requested resource was not found.',
    };

    return notFoundMessages[context] || notFoundMessages.general;
};

/**
 * Get context-specific fallback error messages
 * @param {string} context - Context where error occurred
 * @returns {string} User-friendly error message
 */
const getContextualErrorMessage = (context) => {
    const contextMessages = {
        'login': 'Login failed. Please check your credentials and try again.',
        'register': 'Registration failed. Please check your information and try again.',
        'challenge': 'Failed to load challenge. Please try again.',
        'submission': 'Failed to submit. Please try again.',
        'create': 'Failed to create. Please check your input and try again.',
        'update': 'Failed to update. Please try again.',
        'delete': 'Failed to delete. Please try again.',
        'upload': 'Failed to upload file. Please check the file and try again.',
        'join': 'Failed to join. Please check the code and try again.',
        'general': 'Something went wrong. Please try again.',
    };

    return contextMessages[context] || contextMessages.general;
};

/**
 * Get validation error message for form fields
 * @param {string} field - Field name
 * @param {string} type - Validation type (required, email, min, max, etc.)
 * @param {*} value - Optional value for dynamic messages
 * @returns {string} User-friendly validation message
 */
export const getValidationError = (field, type, value = null) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');

    const validationMessages = {
        'required': `${fieldName} is required.`,
        'email': 'Please enter a valid email address.',
        'min': `${fieldName} must be at least ${value} characters.`,
        'max': `${fieldName} must be no more than ${value} characters.`,
        'minValue': `${fieldName} must be at least ${value}.`,
        'maxValue': `${fieldName} must be no more than ${value}.`,
        'pattern': `${fieldName} format is invalid.`,
        'match': `${fieldName} do not match.`,
        'unique': `This ${field} is already taken.`,
        'invalid': `${fieldName} is invalid.`,
    };

    return validationMessages[type] || `${fieldName} is invalid.`;
};

/**
 * Log error for debugging (only in development)
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 * @param {Object} additionalInfo - Additional debug information
 */
export const logError = (context, error, additionalInfo = {}) => {
    if (import.meta.env.DEV) {
        console.error(`[ERROR] ${context}:`, {
            message: error.message,
            code: error.code,
            stack: error.stack,
            ...additionalInfo
        });
    }
};

export default {
    getUserFriendlyError,
    getValidationError,
    logError
};
