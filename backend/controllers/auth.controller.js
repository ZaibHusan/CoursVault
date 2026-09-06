import jwt from "jsonwebtoken";

export const login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // FIX 1: Use || (OR) instead of && (AND)
        if (process.env.ADMIN_EMAIL !== email || process.env.ADMIN_PASSWORD !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });
        
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    // FIX 2: Clear cookie with the exact same options it was set with
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json({ message: "Logout successful" });
};

export const status = (req, res) => {
    // Return the user data attached by the auth middleware
    res.status(200).json({ message: "User is logged in", admin: req.user });
};

