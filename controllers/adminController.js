const { db } = require("../config/firebaseConfig");
const { doc, getDoc} = require("firebase/firestore");

exports.getAdminProfile = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.render("userAuth/login");
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    console.log("User data retrieved:", userData);

    res.render("admin/adminDashboard", {
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      profilePicture: userData.profilePicture || "https://via.placeholder.com/100"
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};