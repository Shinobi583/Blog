class AppError extends Error {
    constructor(message = "It seems there was an issue loading the page, or the page you are looking for doesn't exist!") {
        super();
        this.message = message;
    }
}

module.exports = AppError;