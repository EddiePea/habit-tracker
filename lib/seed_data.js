const HabitTracker = require("./habit_tracker");
const Habit = require("./habit");

let tracker = new HabitTracker();

let habit1 = new Habit("do yoga");
let habit2 = new Habit("floss teeth");
let habit3 = new Habit("stop vaping");
let habit4 = new Habit("run outside");
let habit5 = new Habit("meditate");

tracker.add(habit1, habit2, habit3, habit4, habit5);

tracker.setCategoryAt(0, "fitness");
tracker.setCategoryAt(1, "general health");
tracker.setCategoryAt(2, "general health");
tracker.setCategoryAt(3, "fitness");
tracker.setCategoryAt(4, "de-stress");

tracker.setUnitAt(0, "minutes");
tracker.setUnitAt(1, "times");
tracker.setUnitAt(2, "times");
tracker.setUnitAt(3, "minutes");
tracker.setUnitAt(4, "minutes");

tracker.setGoalUnitsAt(0, 20);
tracker.setGoalUnitsAt(1, 2);
tracker.setGoalUnitsAt(2, 0);
tracker.setGoalUnitsAt(3, 30);
tracker.setGoalUnitsAt(4, 25);

tracker.setAchievedUnitsAt(0, 18);
tracker.setAchievedUnitsAt(1, 1);
tracker.setAchievedUnitsAt(2, 2);
tracker.setAchievedUnitsAt(3, 20);
tracker.setAchievedUnitsAt(4, 15);

tracker.setAllScores();
tracker.setTotalScore();

module.exports = tracker;