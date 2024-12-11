const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.use(express.json());

router.get("/api/get-user-profile", userController.getUserProfile);

router.post(
  "/dashboard/update-user-profile-picture",
  userController.updateUserProfilePicture
); 

router.get("/challenges/bubblesort", (req, res) => {
  res.render("challenges/bubblesort", { title: "Bubble Sort Challenge" });
});

router.post(
  "/challenges/bubblesort/submit",
  userController.submitBubbleSortChallenge
);

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

router.post(
  "/challenges/quicksort/submit",
  userController.submitQuickSortChallenge
);

router.get("/challenges/selectionsort", (req, res) => {
  res.render("challenges/selectionsort", { title: "Selection Sort Challenge" });
});

router.post("/update-user-progress", userController.updateProgress);
router.get("/dashboard/dfs", (req, res) => {
  res.render("graph/dfs", { title: "Depth-First Search Visualization" });
});

router.get("/dashboard/bfs", (req, res) => {
  res.render("graph/bfs", { title: "Breadth-First Search Visualization" });
});

router.get("/dashboard/dijkstra", (req, res) => {
  res.render("graph/dijkstra", { title: "Dijkstra's Algorithm Visualization" });
});

module.exports = router;