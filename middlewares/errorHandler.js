const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError,
} = require("./httpErrors.js");

const errorHandler = (err, req, res, next) => {
    if (
        err instanceof BadRequestError ||
        err instanceof UnauthorizedError ||
        err instanceof NotFoundError ||
        err instanceof InternalServerError
    ) {
        res.status(err.statusCode).json({
            title: err.title,
            message: err.message,
        });
    } else {
        res.status(500).json({
            title: "Erro interno",
            message: "Ocorreu um erro interno no servidor",
        });
    }
};

module.exports = errorHandler;
