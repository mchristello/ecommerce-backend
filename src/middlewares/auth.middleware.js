const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
        return next();
    }

    return res.render('errors/general', {
        style: 'style.css', 
        error: 'Please login first.'
    });
}

export const AuthMiddleware = { isAuthenticated };