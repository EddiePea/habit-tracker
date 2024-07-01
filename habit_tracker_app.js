const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const HabitTracker = require("./lib/habit_tracker");
const Habit = require("./lib/habit");
const store = require("connect-loki");

const app = express();
const host = "localhost";
const port = 3001;
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
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

app.use((req, res, next) => {
  if (!req.session.tracker) {
    console.log(`there is no tracker`);
    req.session.tracker = new HabitTracker();
    console.log(`This is the new tracker`, req.session.tracker);
  } else {
    console.log(`Making a new tracker`);
    req.session.tracker = HabitTracker.makeHabitTracker(req.session.tracker);
    console.log(`Made new tracker`, req.session.tracker);
  }
  next();
});

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/habits");
});

app.get("/habits", (req, res) => {
  if (req.session.tracker !== undefined) {
    req.session.tracker.sortHabitsAlphabetically();
    req.session.tracker.setTotalScore();
  }
  res.render("habit_list", {
    tracker: req.session.tracker,
  });
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
      .custom((habitTitle, { req }) => {
        let tracker = req.session.tracker;
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
      });
    } else {
      let newHabit = new Habit(habitTitle);
      req.session.tracker.add(newHabit);
      let index = req.session.tracker.findIndexOf(newHabit);
      req.session.tracker.setCategoryAt(index, category);
      req.session.tracker.setUnitAt(index, unit);
      req.session.tracker.setGoalUnitsAt(index, Number(goalUnits));
      req.session.tracker.setAchievedUnitsAt(index, Number(achievedUnits));
      req.session.tracker.setAllScores();
      req.session.tracker.setTotalScore();

      req.flash("success", "New habit created");
      res.redirect("/habits");
    }
});

app.get("/habits/:habitId", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    res.render("habit", { habit });
  }
});

app.post("/habits/:habitId/notes", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    let notes = req.body.notes.trim();
    console.log(`Notes from for: ${notes}`);
    habit.addNotes(notes);
    console.log(`Notes in habit: ${habit.getNotes()}`);

    req.flash("success", "Notes added");
    res.render("habit", { habit });
  }
});

app.get("/habits/:habitId/edit", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    res.render("edit_habit", { habit });
  }
});

app.post("/habits/:habitId/destroy", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (!habit) {
    next(new Error("Not found"));
  } else {
    req.session.tracker.removeAt(req.session.tracker.findIndexOf(habit));
    req.flash("success", "Habit has been deleted");
    res.redirect("/habits");
  }
});

app.post("/habits/:habitId/edit", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);
  let newAchievedUnits = Number(req.body.achievedUnits);
  let newNotes = req.body.notes;

  if (habit === undefined) {
    next(new Error("Not found"));
  } else if (isNaN(newAchievedUnits) || newAchievedUnits < 0) {
    next(new Error("Invalid input for achieved Units"));
  } else if (typeof newNotes !== "string") {
    next(new Error("Invalid input for notes"));
  } else {
    habit.setAchievedUnits(newAchievedUnits);
    habit.setScore();
    habit.resetNotes(newNotes);
    req.flash("success", "Habit updated successfully");
    res.redirect(`/habits/${habitId}`);
  }
});

app.post("/habits/:habitId/mark-achieved", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));
  } else {
    habit.markGoalAchieved();
    habit.setScore();
    req.flash("success", "Habit updated successfully");
    res.redirect(`/habits/${habitId}`);
  }
});

app.post("/habits/:habitId/notes", (req, res, next) => {
  let habitId = Number(req.params.habitId);
  let habit = req.session.tracker.findById(habitId);

  if (habit === undefined) {
    next(new Error("Not found"));

  } else {
    let notes = req.body.notes;
    habit.addNotes(notes);

    req.flash("success", "Notes added successfully");
    res.redirect(`/habits/${habitId}`);
  }
});

// Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
}); 

// Listener
app.listen(port, host, () => {
  console.log(`Habit tracker is listening on port ${port} of ${host}...`);
});
