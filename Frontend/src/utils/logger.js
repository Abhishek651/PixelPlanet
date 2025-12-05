// ============================================
// LOGGING UTILITY
// Centralized logging with different log levels
// Only logs in development mode
// ============================================

const isDevelopment = import.meta.env.DEV;

/**
 * Log levels
 */
const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

/**
 * Format log message with timestamp and context
 * @param {string} level - Log level
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 * @returns {string} Formatted log message
 */
const formatLog = (level, context, message, data) => {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${context}]`;
    return { prefix, message, data };
};

/**
 * Log info message
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
export const logInfo = (context, message, data = null) => {
    if (!isDevelopment) return;
    
    const { prefix } = formatLog(LogLevel.INFO, context, message, data);
    if (data) {
        console.log(`${prefix} ${message}`, data);
    } else {
        console.log(`${prefix} ${message}`);
    }
};

/**
 * Log warning message
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
export const logWarn = (context, message, data = null) => {
    if (!isDevelopment) return;
    
    const { prefix } = formatLog(LogLevel.WARN, context, message, data);
    if (data) {
        console.warn(`${prefix} ${message}`, data);
    } else {
        console.warn(`${prefix} ${message}`);
    }
};

/**
 * Log error message
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {Error|*} error - Error object or additional data
 */
export const logError = (context, message, error = null) => {
    // Always log errors, even in production
    const { prefix } = formatLog(LogLevel.ERROR, context, message, error);
    
    if (error) {
        if (error instanceof Error) {
            console.error(`${prefix} ${message}`, {
                message: error.message,
                stack: error.stack,
                ...error
            });
        } else {
            console.error(`${prefix} ${message}`, error);
        }
    } else {
        console.error(`${prefix} ${message}`);
    }
};

/**
 * Log debug message (only in development)
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
export const logDebug = (context, message, data = null) => {
    if (!isDevelopment) return;
    
    const { prefix } = formatLog(LogLevel.DEBUG, context, message, data);
    if (data) {
        console.debug(`${prefix} ${message}`, data);
    } else {
        console.debug(`${prefix} ${message}`);
    }
};

/**
 * Log API request
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {*} data - Request data
 */
export const logApiRequest = (method, url, data = null) => {
    if (!isDevelopment) return;
    
    logDebug('API', `${method} ${url}`, data);
};

/**
 * Log API response
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} status - Response status code
 * @param {*} data - Response data
 */
export const logApiResponse = (method, url, status, data = null) => {
    if (!isDevelopment) return;
    
    const level = status >= 400 ? 'ERROR' : 'DEBUG';
    const message = `${method} ${url} - ${status}`;
    
    if (level === 'ERROR') {
        logError('API', message, data);
    } else {
        logDebug('API', message, data);
    }
};

/**
 * Log user action
 * @param {string} action - Action name
 * @param {*} data - Action data
 */
export const logUserAction = (action, data = null) => {
    if (!isDevelopment) return;
    
    logInfo('USER_ACTION', action, data);
};

/**
 * Log navigation
 * @param {string} from - Previous route
 * @param {string} to - New route
 */
export const logNavigation = (from, to) => {
    if (!isDevelopment) return;
    
    logInfo('NAVIGATION', `${from} → ${to}`);
};

/**
 * Log authentication event
 * @param {string} event - Event name (login, logout, register, etc.)
 * @param {*} data - Event data
 */
export const logAuthEvent = (event, data = null) => {
    if (!isDevelopment) return;
    
    logInfo('AUTH', event, data);
};

/**
 * Log state change
 * @param {string} component - Component name
 * @param {string} state - State name
 * @param {*} oldValue - Old value
 * @param {*} newValue - New value
 */
export const logStateChange = (component, state, oldValue, newValue) => {
    if (!isDevelopment) return;
    
    logDebug(component, `State change: ${state}`, { oldValue, newValue });
};

/**
 * Create a logger instance for a specific context
 * @param {string} context - Context/module name
 * @returns {Object} Logger instance with bound context
 */
export const createLogger = (context) => {
    return {
        info: (message, data) => logInfo(context, message, data),
        warn: (message, data) => logWarn(context, message, data),
        error: (message, error) => logError(context, message, error),
        debug: (message, data) => logDebug(context, message, data),
    };
};

export default {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logApiRequest,
    logApiResponse,
    logUserAction,
    logNavigation,
    logAuthEvent,
    logStateChange,
    createLogger,
};
