const { db } = require("../config/firebaseConfig");
const admin = require("firebase-admin");
const { collection, getDocs, doc, getDoc, deleteDoc, setDoc, updateDoc, query, where } = require("firebase/firestore");

const serviceAccount = require("../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.render("userAuth/login");
    }

    const adminDocRef = doc(db, "users", userId);
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      console.error("Admin not found for ID:", userId);
      return res.status(404).json({ error: "Admin not found" });
    }

    const adminData = adminDoc.data();

    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.render("admin/adminDashboard", {
      fullName: adminData.fullName,
      email: adminData.email,
      role: adminData.role,
      users,
      profilePicture: adminData.profilePicture || "https://via.placeholder.com/100"
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    await deleteDoc(doc(db, "users", userId));
    console.log(`User ${userId} deleted from Firestore successfully.`);

    await admin.auth().deleteUser(userId);
    console.log(
      `User ${userId} deleted from Firebase Authentication successfully.`
    );

    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.updateUserProfilePicture = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const base64Image = req.body.base64ProfilePicture;

  if (!base64Image) {
    return res.status(400).json({ error: "No base64 image data provided" });
  }

  if (!/^data:image\/[a-zA-Z]*;base64,/.test(base64Image)) {
    return res.status(400).json({ error: "Invalid base64 image format" });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { profilePicture: base64Image });

    res.status(200).json({ redirectUrl: "/admin" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};