const { db } = require("../config/firebaseConfig");
const {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} = require("firebase/firestore");

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.render("userAuth/login");
    }

    // Fetch admin profile for sidebar
    const adminDocRef = doc(db, "users", userId);
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      console.error("Admin not found for ID:", userId);
      return res.status(404).json({ error: "Admin not found" });
    }

    const adminData = adminDoc.data();

    // Fetch all users
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    // Render admin dashboard with user data
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
    console.log(`User ${userId} deleted successfully.`);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
