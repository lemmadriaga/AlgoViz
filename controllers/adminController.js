const { db } = require("../config/firebaseConfig");
const {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} = require("firebase/firestore");
const admin = require("firebase-admin");

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
