const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { doc, setDoc, getDoc, collection, query, where, getDocs } = require("firebase/firestore");
const { auth, db } = require("../config/firebaseConfig");

const emailPattern = /^[a-z0-9._%+-]+@g\.batstate-u\.edu\.ph$/i;

const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let classCode = '';
  for (let i = 0; i < 6; i++) {
    classCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return classCode;
};

const isClassCodeUnique = async (classCode) => {
  const usersCollection = collection(db, "users");
  const classCodeQuery = query(usersCollection, where("classCode", "==", classCode));
  const snapshot = await getDocs(classCodeQuery);
  return snapshot.empty;
};

const getUniqueClassCode = async () => {
  let classCode;
  let unique = false;

  while (!unique) {
    classCode = generateClassCode();
    unique = await isClassCodeUnique(classCode);
  }

  return classCode;
};

exports.signup = async (req, res) => {
  const { fullName, email, password, phone, birthDate, selectedRole, classCode } = req.body;
  
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Use BatStateU GSuite Account example@g.batstate-u.edu.ph" });
  }

  let finalClassCode = classCode;
  let isTeacher = false;
  if (selectedRole === "teacher") {
    finalClassCode = await getUniqueClassCode();
    isTeacher = true;
  } else if (selectedRole === "student") {
    if (!classCode) {
      return res.status(400).json({ error: "Class code is required for students" });
    }

    const usersCollection = collection(db, "users");
    const classCodeQuery = query(usersCollection, where("classCode", "==", classCode));
    const snapshot = await getDocs(classCodeQuery);

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid class code. Please check with your teacher." });
    }
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    
    const userData = {
      fullName,
      email,
      phone,
      birthDate,
      role: selectedRole,
      classCode: finalClassCode || null,
      createdAt: new Date().toISOString(),
    };
    
    if (!isTeacher) {
      userData.challenges = {
        bubbleSort: false,
        insertionSort: false,
        selectionSort: false,
        quickSort: false,
        mergeSort: false,
        heapSort: false,
      };

      userData.progess = 0;
    }
    
    await setDoc(doc(db, "users", user.uid), userData);

    res
      .status(201)
      .json({ message: "User registered successfully", uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Use BatStateU GSuite Account example@g.batstate-u.edu.ph" });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User not found for ID:", user.uid);
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    req.session.userId = user.uid;

    if (userData.role === "student") {
      return res.redirect(`/dashboard`);
    } else if (userData.role === "teacher") {
      return res.redirect(`/teacher`);
    } else if (userData.role === "admin") {
      return res.redirect(`/admin`);
    }
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Invalid email or password" });
  }
};