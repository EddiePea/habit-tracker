const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const HabitTracker = require("./lib/habit_tracker");
const Habit = require("./lib/habit");
const store = require("connect-loki");

let tracker = require("./lib/seed_data");

const app = express();
const host = "localhost";
const port = 3000;
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "habit-tracker-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

app.use(flash());

//Extract session info and add to the res.locals object 
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

//Primary route for the app >> handles GET requests to the root path 
//renders the "habit_lists.pug view" in alphabetical order 
app.get("/", (req, res) => {
  res.redirect("/habits");
});

app.get("/habits", (req, res) => {
  if (tracker !== undefined) {
    tracker.sortHabitsAlphabetically();
  }
  tracker.setTotalScore();
  res.render("habit_list", { tracker });
});

app.get("/habits/new", (req, res) => {
  res.render("add_habit");
});

app.post("/habits", 

  [
    body("habitTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a habit title")
      .isString()
      .withMessage("Please enter a valid title")
      .isLength({ max: 100 })
      .withMessage("Habit title must be between 1 and 100 chars")
      .custom(habitTitle => {
        let duplicate = tracker.habits.find(habit => habit.title === habitTitle);
        return duplicate === undefined;
      })
      .withMessage("You are already tracking this habit! Pick another")   
  ],
  (req, res) => {
    let errors = validationResult(req);
    let { habitTitle, category, unit, goalUnits, achievedUnits } = req.body;

    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("add_habit", {
        flash: req.flash(),
        habitTitle: habitTitle,
        category: category,
        unit: unit,
        goalUnits: goalUnits,
        achievedUnits: achievedUnits,
      })
    } else {
      let newHabit = new Habit(habitTitle);
      tracker.add(newHabit);
      let index = tracker.findIndexOf(newHabit);
      tracker.setCategoryAt(index, category);
      tracker.setUnitAt(index, unit);
      tracker.setGoalUnitsAt(index, Number(goalUnits));
      tracker.setAchievedUnitsAt(index, Number(achievedUnits));
      tracker.setAllScores();
      tracker.setTotalScore();
      
      req.flash("success", "New habit created");
      res.redirect("/habits");
  }
});

app.get("/habits/:habitId", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    res.render("habit", { habit });
  } 
});

app.post("/habits/:habitId/notes", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    let notes = req.body.notes;
    habit.addNotes(notes);

    res.render("habit", { habit });
  }
});

app.get("/habits/:habitId/edit", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    res.render("edit_habit", { habit });
  }
});

app.post("/habits/:habitId/destroy", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);

  if(!habit) {
    next(new Error("Not found"));

  } else {
    tracker.removeAt(tracker.findIndexOf(habit));
    req.flash("success", "Habit has been deleted");
    res.redirect("/habits");
  }
});

app.post("/habits/:habitId/save", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);
  let newAchievedUnits = Number(req.body.achievedUnits);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else if (isNaN(newAchievedUnits) || newAchievedUnits < 0) {
    next(new Error("Invalid input for achieved Units"));
  } else {
    habit.setAchievedUnits(newAchievedUnits);
    habit.setScore();
    req.flash("success", "Habit updated successfully");
    res.redirect(`/habits/${habitId}`);
  }
});

app.post("/habits/:habitId/mark-achieved", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    habit.markGoalAchieved();
    habit.setScore();
    req.flash("success", "habit updated successfully");
    res.redirect(`/habits/${habitId}`);
  }
});

//Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
}); 

//Listener
app.listen(port, host, () => {
  console.log(`Habit tracker is listening on port ${port} of ${host}...`);
});