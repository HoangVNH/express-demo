class BaseServiceException extends Error {
    constructor(message, status = 400) {
        super(message);

        this.status = status;

        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        
        this.error = {
            name: this.name,
            message: message,
            stack: this.stack,
        };

        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseServiceException