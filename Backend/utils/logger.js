// ============================================
// BACKEND LOGGING UTILITY
// Centralized logging for backend with different log levels
// ============================================

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
 * @returns {string} Formatted log prefix
 */
const formatLog = (level, context) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${context}]`;
};

/**
 * Log info message
 * @param {string} context - Context/module name
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
const logInfo = (context, message, data = null) => {
    const prefix = formatLog(LogLevel.INFO, context);
    if (data) {
        console.log(`${prefix} ${message}`, JSON.stringify(data, null, 2));
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
const logWarn = (context, message, data = null) => {
    const prefix = formatLog(LogLevel.WARN, context);
    if (data) {
        console.warn(`${prefix} ${message}`, JSON.stringify(data, null, 2));
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
const logError = (context, message, error = null) => {
    const prefix = formatLog(LogLevel.ERROR, context);
    
    if (error) {
        if (error instanceof Error) {
            console.error(`${prefix} ${message}`, {
                message: error.message,
                stack: error.stack,
                code: error.code,
            });
        } else {
            console.error(`${prefix} ${message}`, JSON.stringify(error, null, 2));
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
const logDebug = (context, message, data = null) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const prefix = formatLog(LogLevel.DEBUG, context);
    if (data) {
        console.debug(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
        console.debug(`${prefix} ${message}`);
    }
};

/**
 * Log HTTP request
 * @param {Object} req - Express request object
 */
const logRequest = (req) => {
    const context = 'HTTP';
    const message = `${req.method} ${req.path}`;
    const data = {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        user: req.uid || 'anonymous',
        ip: req.ip,
    };
    
    logInfo(context, message, data);
};

/**
 * Log HTTP response
 * @param {Object} req - Express request object
 * @param {number} statusCode - Response status code
 * @param {*} data - Response data
 */
const logResponse = (req, statusCode, data = null) => {
    const context = 'HTTP';
    const message = `${req.method} ${req.path} - ${statusCode}`;
    
    if (statusCode >= 400) {
        logError(context, message, data);
    } else {
        logInfo(context, message, data);
    }
};

/**
 * Log authentication event
 * @param {string} event - Event name (login, logout, register, etc.)
 * @param {string} userId - User ID
 * @param {*} data - Event data
 */
const logAuthEvent = (event, userId, data = null) => {
    const context = 'AUTH';
    const message = `${event} - User: ${userId}`;
    logInfo(context, message, data);
};

/**
 * Log database operation
 * @param {string} operation - Operation name (create, read, update, delete)
 * @param {string} collection - Collection name
 * @param {string} documentId - Document ID
 * @param {*} data - Operation data
 */
const logDbOperation = (operation, collection, documentId, data = null) => {
    const context = 'DATABASE';
    const message = `${operation.toUpperCase()} ${collection}/${documentId}`;
    logDebug(context, message, data);
};

/**
 * Log permission check
 * @param {string} userId - User ID
 * @param {string} action - Action being checked
 * @param {boolean} allowed - Whether action is allowed
 * @param {string} reason - Reason for decision
 */
const logPermissionCheck = (userId, action, allowed, reason = null) => {
    const context = 'PERMISSION';
    const message = `User ${userId} - ${action} - ${allowed ? 'ALLOWED' : 'DENIED'}`;
    const data = { userId, action, allowed, reason };
    
    if (allowed) {
        logDebug(context, message, data);
    } else {
        logWarn(context, message, data);
    }
};

/**
 * Create a logger instance for a specific context
 * @param {string} context - Context/module name
 * @returns {Object} Logger instance with bound context
 */
const createLogger = (context) => {
    return {
        info: (message, data) => logInfo(context, message, data),
        warn: (message, data) => logWarn(context, message, data),
        error: (message, error) => logError(context, message, error),
        debug: (message, data) => logDebug(context, message, data),
    };
};

module.exports = {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logRequest,
    logResponse,
    logAuthEvent,
    logDbOperation,
    logPermissionCheck,
    createLogger,
};
