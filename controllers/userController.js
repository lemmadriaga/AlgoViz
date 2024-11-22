const { db } = require("../config/firebaseConfig");
const { doc, getDoc, updateDoc } = require("firebase/firestore");


//   const userId = req.session.userId;

//   if (!userId) {
//     throw new Error("Unauthorized access");
//   }

//   const userDocRef = doc(db, "users", userId);
//   const userDoc = await getDoc(userDocRef);
//   const userData = userDoc.data();

//   const trueSortingCount = Object.values(userData.sorting).filter(
//     (value) => value === true
//   ).length;
//   const trueSearchCount = Object.values(userData.searching).filter(
//     (value) => value === true
//   ).length;

//   const trueChallengeCount = Object.values(userData.challenges).filter(
//     (value) => value === true
//   ).length;
//   const progress =
//     100 / 9 + (trueSortingCount + trueSearchCount + trueChallengeCount);
//   await updateDoc(userDocRef, { progress });
// };

const updateProgressValue = async (req) => {
  const userId = req.session.userId;

  if (!userId) {
    throw new Error("Unauthorized access");
  }

  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();

  const trueChallengeCount = Object.values(userData.challenges).filter(
    (value) => value === true
  ).length;
  const progress = 100 / 6 * (trueChallengeCount);
  await updateDoc(userDocRef, { progress });
};

exports.updateProgress = async (req, res) => {
  const { bubbleSort, firstQuestion } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    if (bubbleSort === "bubbleSort" && firstQuestion === "D") {
      await updateDoc(userDocRef, { "sorting.bubbleSort": true });
      await updateProgressValue(req);
      return res
        .status(200)
        .json({ message: "Progress and sorting updated successfully" });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid input or conditions not met" });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ error: "Failed to update progress" });
  }
};

// const isUnlocked = async (req, res, prevChal) => {
//   const userId = req.session.userId;

//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized access" });
//   }

//   const userDocRef = doc(db, "users", userId);
//   const userDoc = await getDoc(userDocRef);
//   const userData = userDoc.data();

//   if(userData.challenges[prevChal]) {
//     return true; 
//   }

//   return false;
// };

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
      progress: userData.progress,
      profilePicture:
        userData.profilePicture || "https://via.placeholder.com/100",
      challenges: userData.challenges
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

exports.submitBubbleSortChallenge = async (req, res) => {
  const { userAnswers } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized access" });
  }

  const correctAnswers = [
    ["26", "54", "17", "77", "31", "44", "93"], // Pass 1
    ["26", "17", "54", "31", "44", "77", "93"], // Pass 2
    ["17", "26", "31", "44", "54", "77", "93"], // Pass 3
    ["17", "26", "31", "44", "54", "77", "93"], // Pass 4
    ["17", "26", "31", "44", "54", "77", "93"], // Final Sorted Array
  ];

  try {
    const userPasses = [];
    let index = 0;
    for (let pass of correctAnswers) {
      userPasses.push(userAnswers.slice(index, index + pass.length));
      index += pass.length;
    }

    const isPassCorrect = userPasses.every((userPass, passIndex) => {
      const correctPass = correctAnswers[passIndex];
      return (
        userPass.length === correctPass.length &&
        userPass.sort().join() === correctPass.sort().join()
      );
    });

    if (isPassCorrect) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { "challenges.bubbleSort": true });
      await updateProgressValue(req);

      return res
        .status(200)
        .json({ success: true, message: "Congratulations! All answers are correct!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Some passes are incorrect." });
    }
  } catch (error) {
    console.error("Error validating answers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.submitHeapSortChallenge = async (req, res) => {
  const { userAnswers } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized access" });
  }

  const correctAnswers = [
    [8, 4, 10, 14, 7, 9, 3, 2, 1, 16], // Initial array
    [16, 14, 10, 8, 7, 9, 3, 2, 4, 1], // After building max heap
    [14, 8, 10, 4, 7, 9, 3, 2, 1, 16], // After first extraction
    [10, 8, 9, 4, 7, 1, 3, 2, 14, 16], // After second extraction
    [9, 8, 3, 4, 7, 1, 2, 10, 14, 16], // After third extraction
    [1, 2, 3, 4, 7, 8, 9, 10, 14, 16]  // Final sorted array
  ];

  try {
    const isCorrect = userAnswers.every((answer, index) => 
      JSON.stringify(answer) === JSON.stringify(correctAnswers[index])
    );

    if (isCorrect) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { "challenges.heapSort": true });
      await updateProgressValue(req);

      return res
        .status(200)
        .json({ success: true, message: "Congratulations! All answers are correct!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Some answers are incorrect. Try again!" });
    }
  } catch (error) {
    console.error("Error validating answers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.submitInsertionSortChallenge = async (req, res) => {
  const { userAnswers } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized access" });
  }

  const correctAnswers = [
    [64, 34, 25, 12, 22, 11, 90],  // Initial array
    [34, 64, 25, 12, 22, 11, 90],  // First pass
    [25, 34, 64, 12, 22, 11, 90],  // Second pass
    [12, 25, 34, 64, 22, 11, 90],  // Third pass
    [12, 22, 25, 34, 64, 11, 90],  // Fourth pass
    [11, 12, 22, 25, 34, 64, 90]   // Final sorted array
  ];

  try {
    const isCorrect = userAnswers.every((answer, index) => 
      JSON.stringify(answer) === JSON.stringify(correctAnswers[index])
    );

    if (isCorrect) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { "challenges.insertionSort": true });
      await updateProgressValue(req);

      return res
        .status(200)
        .json({ success: true, message: "Congratulations! All steps are correct!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Some steps are incorrect. Try again!" });
    }
  } catch (error) {
    console.error("Error validating answers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.submitMergeSortChallenge = async (req, res) => {
  const { userCode } = req.body;
  const userId = req.session.userId;

  const testArray = [38, 27, 43, 3, 9, 82, 10];
  const correctResult = [3, 9, 10, 27, 38, 43, 82];

  try {
    
    const userFunction = new Function(`${userCode}; return mergeSort;`);
    const mergeSortFunction = userFunction();

    if (typeof mergeSortFunction !== "function") {
      throw new Error("mergeSort is not defined or not a function.");
    }
    
    const userResult = mergeSortFunction([...testArray]);

    console.log("Expected Result:", correctResult);
    console.log("User Result:", userResult);

    
    if (Array.isArray(userResult) && JSON.stringify(userResult) === JSON.stringify(correctResult)) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { "challenges.mergeSort": true });
      await updateProgressValue(req);

      return res.status(200).json({
        success: true,
        message: "Congratulations! Merge Sort implemented correctly! 🎉",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Your implementation is incorrect. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in submitted code:", error.message);
    return res.status(400).json({
      success: false,
      message: `Error in your code: ${error.message}`,
    });
  }
};