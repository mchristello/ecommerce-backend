import MyRouter from "./router.js";



export default class SessionRouter extends MyRouter {

    init() {
        // Trae los datos del user loguedo
        this.get('/current', (req, res) => {
            try {
                const user = req.session.user;

                if (!user) return res.sendAuthenticationError(`No user logged`);

                return res.sendSuccess({ user })
            } catch (error) {
                return res.sendAuthenticationError(error);
            }
        })
    }
}