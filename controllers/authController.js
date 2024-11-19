const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const { auth, db } = require("../config/firebaseConfig");

const emailPattern = /^[a-z0-9._%+-]+@g\.batstate-u\.edu\.ph$/i;

exports.signup = async (req, res) => {
  const { fullName, email, password, phone, birthDate } = req.body;
  
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Use BatStateU GSuite Account example@g.batstate-u.edu.ph" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone,
      birthDate,
      role: "user",
      progress: 0,
      sorting: {
        bubbleSort: false,
        insertionSort: false,
        selectionSort: false,
        quickSort: false,
        mergeSort: false,
        heapSort: false
      },
      searching: {
        linearSearch: false,
        binarySearch: false,
        twoPointers: false
      },
      createdAt: new Date().toISOString(),
    });

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

    if (userData.role === "user") {
      return res.redirect(`/dashboard`);
    } else if (userData.role === "admin") {
      return res.redirect(`/admin`);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Invalid email or password" });
  }
};