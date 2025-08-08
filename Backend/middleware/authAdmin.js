import jwt from 'jsonwebtoken';

//admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if (!atoken) {
            return res.status(401).json({ message: 'Not authorized : Login Again' });
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ message: 'Access denied : Admins only' });
        }
        next();
    } catch (error) {
        console.log('Error in authAdmin middleware:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
}
export default authAdmin;