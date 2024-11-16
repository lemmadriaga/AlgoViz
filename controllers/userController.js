const { db } = require("../config/firebaseConfig");
const { doc, getDoc, updateDoc } = require("firebase/firestore");

exports.getUserProfile = async (req, res) => {
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

    res.render("userDashboard/dashboard", {
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

exports.updateUserProfilePicture = async (req, res) => {
  const userId = req.session.userId;
  const { profilePicture } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { profilePicture });
    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};