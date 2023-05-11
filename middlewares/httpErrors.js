class BadRequestError extends Error {
    constructor(message = "Requisição inválida") {
        super(message);
        this.title = "Erro de Requisição";
        this.statusCode = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message = "Não autorizado") {
        super(message);
        this.title = "Erro de Autenticação";
        this.statusCode = 401;
    }
}

class NotFoundError extends Error {
    constructor(message = "Não encontrado") {
        super(message);
        this.title = "Erro de Recurso";
        this.statusCode = 404;
    }
}

class InternalServerError extends Error {
    constructor(message = "Erro interno do servidor") {
        super(message);
        this.title = "Erro Interno";
        this.statusCode = 500;
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError,
};
