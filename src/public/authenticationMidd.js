//MIDDLEWARS PARA LOGIN Y REGISTER

// Middleware para verificar si el usuario está autenticado
const isLogged = (req, res, next) => {
    if(req.isAuthenticated()) return next()
    res.redirect('/api/sessions/login')
}

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin') return next()
    res.status(403).json({ message: 'No tiene autorización para esta seccion' });
}


// Middleware para verificar si el usuario es premium
const isPremium = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'premium') return next()
    res.status(403).json({ message: 'No tiene autorización para esta seccion' });
}

// Middleware para verificar roles autorizados (premium o admin)
const checkRole = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next();
    }
    res.status(403).json({ message: 'No tiene autorización para esta sección' });
};



// Función para verificar credenciales de administrador
const isAuthorizedAdmin = (email) => {
    const authorizedEmails = [
        'adminCoder@coder.com',
        'jaf937@gmail.com',
        'alexmarinmendez@gmail.com'
    ]
    return authorizedEmails.includes(email)
}


export { isLogged, isAdmin, isPremium, checkRole, isAuthorizedAdmin }



// Middleware para verificar si el usuario es administrador
// const isAdmin = (req, res, next) => {
//     if(req.isAuthenticated() && req.session.user.role === 'admin') return next()
//     res.status(403).json({ message: 'No tiene autorización para esta seccion' });
// }
