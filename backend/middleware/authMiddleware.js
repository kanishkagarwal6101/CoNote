import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("Headers Received:", req.headers); // Debugging

    const authHeader = req.header("Authorization"); // Read Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid Authorization header found"); // Debugging
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    console.log("Extracted Token:", token); // Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    console.log("Decoded User ID:", decoded.id); // Debugging

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err); // Debugging
    res.status(500).json({ error: "Server error" });
  }
};

export default authMiddleware;
