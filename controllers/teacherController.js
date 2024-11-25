const { db } = require("../config/firebaseConfig");
const admin = require("firebase-admin");
const { collection, getDocs, doc, getDoc, deleteDoc, setDoc, updateDoc, query, where } = require("firebase/firestore");

const serviceAccount = require("../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.getStudentsInClass = async (req, res) => {
  const userId = req.session.userId; // Corrected line

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    if (userData.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can view students in their class." });
    }

    const { classCode } = userData;

    const usersCollection = collection(db, "users");
    const studentsQuery = query(
      usersCollection,
      where("classCode", "==", classCode),
      where("role", "==", "student")
    );

    const snapshot = await getDocs(studentsQuery);

    if (snapshot.empty) {
      return res.status(404).json({ error: "No students found in your class." });
    }

    const students = [];
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });

    res.render('teacher/teacherDashboard',
      { users: students,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        classCode: userData.classCode,
        profilePicture: userData.profilePicture || "https://via.placeholder.com/100"
       });
  } catch (error) {
    console.error("Error fetching students in class:", error);
    res.status(500).json({ error: "Failed to fetch students in class" });
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

    res.status(200).json({ redirectUrl: "/teacher" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};