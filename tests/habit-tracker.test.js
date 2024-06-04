const HabitTracker = require("../lib/habit_tracker.js");
const Habit = require("../lib/habit.js");

describe("Testing the HabitTracker class", () => {

  let tracker;

  beforeEach(() => tracker = new HabitTracker());

  test("Only habit objects can be added", () => {
    expect(() => { tracker.add(10)}).toThrow();
  });

  test("Only habit objects with unique titles can be added", () => {
    tracker.add(new Habit("do yoga"));
    expect(() => { tracker.add(new Habit("do yoga"))}).toThrow();
  });

  test("The add method adds a new habit to the tracker", () => {
    tracker.add(new Habit("do yoga"));
    expect(tracker.size()).toBe(1);
  });

  test("removeAt removes a habit at a given index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    tracker.add(habit1, habit2);

    tracker.removeAt(0);

    expect(tracker.size()).toBe(1);
    expect(tracker.itemAt(0)).toBe(habit2);
  });

  test("itemAt returns a habit object at a specific index (after validating that the habit at that index exists)", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    tracker.add(habit1, habit2);

    expect(tracker.itemAt(0)).toEqual(habit1);
  });

  test("If there is no habit at the given index, it throws an error", () => {
    expect(() => { tracker.itemAt(0) }).toThrow();
  });
  
  test("size returns the number of habit items in the tracker", () => {
    tracker.add(new Habit("do yoga"));
    tracker.add(new Habit("floss teeth"));

    expect(tracker.size()).toBe(2);
  });

  test("First returns the first habit object in the tracker", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    tracker.add(habit1, habit2);

    expect(tracker.first()).toEqual(habit1);
  });

  test("Last returns the last habit object in the tracker", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    tracker.add(habit1, habit2);

    expect(tracker.last()).toEqual(habit2);
  });

  test("Shift removes and returns the first habit", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape")
    tracker.add(habit1, habit2, habit3);

    expect(tracker.shift()).toEqual(habit1);
  });

  test("Pop removes and returns the last habit", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape")
    tracker.add(habit1, habit2, habit3);

    expect(tracker.pop()).toEqual(habit3);
  });
  
  test("Filter returns a new habit tracker object", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape")
    tracker.add(habit1, habit2, habit3);

    expect(tracker.filter(habit => habit.title === "floss teeth")).not.toEqual(tracker);
  });
  
  test("findbyTitle returns a habit object by reference to its title", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape")
    tracker.add(habit1, habit2, habit3);

    expect(tracker.findByTitle("don't vape")).toBe(habit3);
  });

  test("setTitleAt changes the title of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setTitleAt(1, "go for a walk");
    expect(habit2.getTitle()).toBe("go for a walk");
  });
  
  test("setCategoryAt changes the category of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setCategoryAt(0, "sport");
    expect(habit1.getCategory()).toBe("sport");
  });

  test("setUnitAt changes the unit of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setUnitAt(1, "times");
    expect(habit2.getUnit()).toBe("times");
  });
  
  test("setGoalUnitsAt changes the goalUnits of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setGoalUnitsAt(2, 0);
    expect(habit2.getGoalUnits()).toBe(0);
  });
  
  test("setAchievedUnitsAt changes the achievedUnits of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setAchievedUnitsAt(2, 5);
    expect(habit3.getAchievedUnits()).toBe(5);
  });
  
  test("increaseAchievedUnitsAt increases the achievedUnits of a habit at a particular index by 1", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit3.setAchievedUnits(5);
    tracker.increaseAchievedUnitsAt(2);

    expect(habit3.getAchievedUnits()).toBe(6);
  });
  
  test("decreaseAchievedUnits decreases the achievedUnits of a habit at a particular index by 1", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit3.setAchievedUnits(5);
    tracker.decreaseAchievedUnitsAt(2);

    expect(habit3.getAchievedUnits()).toBe(4);
  });
  
  test("calculateScoreAt calculates the score of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(10);
    habit1.setAchievedUnits(8);

    expect(habit1.calculateScore()).toBe(80);
  });

  test("setScoreAt calculates and sets the score of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(10);
    habit1.setAchievedUnits(8);
    habit1.setScore();

    expect(habit1.getScore()).toBe(80);
  });

  test("markGoalAchievedAt changes the achievedUnits of a habit at a particular index to the goalUnits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    tracker.setGoalUnitsAt(0, 10);
    tracker.markGoalAchievedAt(0);
    tracker.setScoreAt(0);

    expect(habit1.getScore()).toBe(100);
  });

  test("setAchievedUnitsToZeroAt changes the achieved units of a habit at a particular index to 0", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setAchievedUnits(10);
    tracker.setAchievedUnitsToZeroAt(0);

    expect(habit1.getAchievedUnits()).toBe(0);
  });

  test("getTitleAt returns the title of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    expect(tracker.getTitleAt(2)).toBe("don't vape");
  });

  test("getCategoryAt returns the category of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setCategory("sport");
    habit2.setCategory("oral health");
    habit3.setCategory("general health");

    expect(tracker.getCategoryAt(1)).toBe("oral health");
  });

  test("getUnitAt returns the unit of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setUnit("minutes");
    habit2.setUnit("times");
    habit3.setUnit("times");

    expect(tracker.getUnitAt(0)).toBe("minutes");
  });

  test("getGoalUnitsAt returns the goalUnits of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    expect(tracker.getGoalUnitsAt(2)).toBe(0);
  });
  
  test("getAchievedUnitsAt returns the achievedUnits of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    expect(tracker.getAchievedUnitsAt(0)).toBe(18);
  });

  test("getScoreAt returns the score of a habit at a particular index", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    habit2.setScore();
    expect(tracker.getScoreAt(1)).toBe(50);
  });
  
  test("markAllGoalsAchieved sets the achievedUnits of all habits to the goalUnits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    tracker.markAllGoalsAchieved();

    expect(habit1.getAchievedUnits()).toBe(20);
    expect(habit2.getAchievedUnits()).toBe(2);
    expect(habit3.getAchievedUnits()).toBe(0);
  });

  test("setAllScores calculates and sets the scores for all of the habits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    tracker.setAllScores();

    expect(habit1.getScore()).toBe(90);
    expect(habit2.getScore()).toBe(50);
    expect(habit3.getScore()).toBe(0);
  });

  test("sortHabitsAlphabetically mutates the habits property of habit tracker and returns the same object", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);
    let habits = tracker.habits;
    tracker.sortHabitsAlphabetically();
    expect(tracker.habits === habits).toBeTruthy();
  });
  
  test("sortHabitsAlphabetically sorts the habits into alphabetical order", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);
    tracker.sortHabitsAlphabetically();
    expect(tracker.habits[2]).toBe(habit2);
  });

  test("sortHabitsByCategory sorts the habits into categories listed in alphabetical order", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    let habit4 = new Habit("brush teeth");
    let habit5 = new Habit("walk");
    tracker.add(habit1, habit2, habit3, habit4, habit5);

    habit1.setCategory("sport");
    habit2.setCategory("oral health");
    habit3.setCategory("general health");
    habit4.setCategory("oral health");
    habit5.setCategory("sport");

    tracker.sortHabitsByCategory();
    expect(tracker.habits).toEqual([habit3, habit4, habit2, habit1, habit5]);
  });

  test("setTotalScore calculates and sets the total score for all habits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    tracker.setTotalScore();
    expect(tracker.totalScore).toBe(47);
  });

  test("getTotalScore returns the totalScore", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    tracker.setTotalScore();
    expect(tracker.getTotalScore()).toBe(47);
  });

  test("getAllFailedHabits returns a new tracker object with a habits property containing habits with a score of 0", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    let habit4 = new Habit("go running");
    tracker.add(habit1, habit2, habit3, habit4);

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);
    habit4.setGoalUnits(20);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);
    habit4.setAchievedUnits(0);

    let filteredTracker = new HabitTracker();
    filteredTracker.add(habit3, habit4);

    expect(tracker.getAllFailedHabits()).toEqual(filteredTracker);
  });

  test("filterForCategory returns a new tracker object with a habits property containin only habits of the specified category", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    let habit4 = new Habit("brush teeth");
    let habit5 = new Habit("walk");
    tracker.add(habit1, habit2, habit3, habit4, habit5);

    habit1.setCategory("sport");
    habit2.setCategory("oral health");
    habit3.setCategory("general health");
    habit4.setCategory("oral health");
    habit5.setCategory("sport");

    let filteredTracker = new HabitTracker();
    filteredTracker.add(habit1, habit5);

    expect(tracker.filterForCategory("sport")).toEqual(filteredTracker);
  });

  test("getAllHabits returns a new array of all the habits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    let habit4 = new Habit("brush teeth");
    let habit5 = new Habit("walk");

    let habits = [habit1, habit2, habit3, habit4, habit5];

    tracker.add(...habits);

    let newTracker = new HabitTracker();
    newTracker.add(...habits);

    expect(tracker.getAllHabits()).toEqual(newTracker);
  });
  
  test("toString returns the joined strings of all the habits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);

    habit1.setUnit("minutes");
    habit2.setUnit("times");
    habit3.setUnit("times");

    habit1.setGoalUnits(20);
    habit2.setGoalUnits(2);
    habit3.setGoalUnits(0);

    habit1.setAchievedUnits(18);
    habit2.setAchievedUnits(1);
    habit3.setAchievedUnits(1);

    habit1.setScore(); // 90 
    habit2.setScore(); // 50
    habit3.setScore(); // 0

    expect(tracker.toString()).toBe(
      "HABIT: do yoga || GOAL: 20 minutes per day || SCORE TODAY: 90%\n" +
      "HABIT: floss teeth || GOAL: 2 times per day || SCORE TODAY: 50%\n" + 
      "HABIT: don't vape || GOAL: 0 times per day || SCORE TODAY: 0%"
    );

  });

  test("validateIndex throws a reference error if the index passed to it is not in this.habits", () => {
    let habit1 = new Habit("do yoga");
    let habit2 = new Habit("floss teeth");
    let habit3 = new Habit("don't vape");
    tracker.add(habit1, habit2, habit3);
    expect(() => { tracker._validateIndex(3) }).toThrow(ReferenceError);
  });
});

