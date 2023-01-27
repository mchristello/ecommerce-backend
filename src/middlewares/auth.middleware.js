const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
        return next();
    }

    return res.status(401).send("User unauthorized");
}

export const AuthMiddleware = { isAuthenticated };