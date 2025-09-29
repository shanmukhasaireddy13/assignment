const requireRole = (roles) => {
    return (req, res, next) => {
        const role = req.user?.role || 'user';
        const allowed = Array.isArray(roles) ? roles : [roles];
        if (!allowed.includes(role)) {
            // Hide existence of the route from non-admins
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        next();
    }
}

export default requireRole;


