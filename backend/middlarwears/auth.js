import jwt from "jsonwebtoken";


export const auth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // FIX 3: Actually verify the token cryptographically
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded || decoded.role !== "admin" || decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.user = decoded; 
        
        next();
    } catch (error) {
        // Catches expired or tampered tokens
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" }); 
    }
};