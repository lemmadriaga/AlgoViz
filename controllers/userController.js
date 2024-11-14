const { db } = require("../config/firebaseConfig");

exports.getUserProfile = async (req, res) => {
  const userId = req.session.userId;

  console.log("Session user ID:", userId);

  if (!userId) {
    console.error("Unauthorized access: No user ID in session");
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    console.log("User data retrieved:", userData);

    res.status(200).json({
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      profilePicture:
        userData.profilePicture || "https://via.placeholder.com/100",
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
    await db.collection("users").doc(userId).update({ profilePicture });
    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};
