const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("./httpErrors");

const authenticateToken = asyncHandler((req, res, next) => {
    const authHeader =
        req.headers.authorization || req.headers.Authorization || "";
    const [bearer, token] = authHeader.split(" ");
    if (token && bearer === "Bearer") {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                throw new ForbiddenError("Acesso negado.");
            }
            req.user = decoded.user;
            next();
        });
    } else {
        throw new UnauthorizedError("Token de acesso ausente ou inválido.");
    }
});

module.exports = authenticateToken;
