const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/api/get-user-profile", userController.getUserProfile);
router.get("/challenges/bubblesort", (req, res) => {
  res.render("challenges/bubblesort", { title: "Bubble Sort Challenge" });
});

router.get("/challenges/heapsort", (req, res) => {
  res.render("challenges/heapsort", { title: "Heap Sort Challenge" });
});
router.get("/challenges/heapsort", (req, res) => {
  res.render("challenges/heapsort", { title: "Heap Sort Challenge" });
});

router.post(
  "/challenges/heapsort/submit",
  userController.submitHeapSortChallenge
);
router.get("/challenges/insertionsort", (req, res) => {
  res.render("challenges/insertionsort", { title: "Insertion Sort Challenge" });
});
router.post(
  "/challenges/insertionsort/submit",
  userController.submitInsertionSortChallenge
);

router.post(
  "/challenges/bubblesort/submit",
  userController.submitBubbleSortChallenge
);

router.get("/challenges/mergesort", (req, res) => {
  res.render("challenges/mergesort", { title: "Merge Sort Challenge" });
});
router.post(
  "/challenges/mergesort/submit",
  userController.submitMergeSortChallenge
);

router.get("/challenges/quicksort", (req, res) => {
  res.render("challenges/quicksort", { title: "Quick Sort Challenge" });
});
router.get("/challenges/selectionsort", (req, res) => {
  res.render("challenges/selectionsort", { title: "Selection Sort Challenge" });
});
router.post(
  "/update-user-profile-picture",
  userController.updateUserProfilePicture
);

router.post("/update-user-progress", userController.updateProgress);

module.exports = router;
