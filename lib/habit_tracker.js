const Habit = require("./habit");
const nextId = require("./next-id");

class HabitTracker {
  constructor() {
    this.habits = [];
    this.totalScore = 0;
  }

  //Only allows habit objects with unique titles to be added
  add(...habits) {

    habits.forEach(habit => {
      if (!(habit instanceof Habit)) {
        throw new TypeError("Can only add Habit objects");
      }
  
      if (this.habits.some(existingHabit => existingHabit.getTitle() === habit.getTitle())) {
        throw new Error("This habit already exists! Please choose a new habit");
      }
  
      this.habits.push(habit);
    });
  }

  uniqueTitle(habit) {
    if (this.habits.some(existingHabit => existingHabit.getTitle() === habit.getTitle())) {
      throw new Error("This habit already exists! Please choose a new habit");
    }
  }

  removeAt(index) {
    this._validateIndex(index);
    return this.habits.splice(index, 1);
  }

  itemAt(index) {
    this._validateIndex(index);
    return this.habits[index];
  }

  size() {
    return this.habits.length;
  }

  first() {
    return this.itemAt(0);
  }

  last() {
    return this.itemAt(this.size() - 1);
  }

  shift() {
    return this.habits.shift();
  }

  pop() {
    return this.habits.pop();
  }

  forEach(callback) {
    return this.habits.forEach(habit => callback(habit));
  }

  filter(callback) {
    let newTracker = new HabitTracker();
    this.forEach(habit => {
      if (callback(habit)) {
        newTracker.add(habit);
      }
    });
    return newTracker;
  }

  findByTitle(title) {
    return this.habits.filter(habit => habit.getTitle() === title)[0];
  }

  findById(id) {
    return this.filter(habit => habit.id === id).first();
  }

  findIndexOf(habitToFind) {
    let findId = habitToFind.id;
    return this.habits.findIndex(habit => habit.id === findId);
  }

  setTitleAt(index, title) {

    this.itemAt(index).setTitle(title);
  }

  setCategoryAt(index, category) {
    this.itemAt(index).setCategory(category);
  }

  setUnitAt(index, unit) {
    this.itemAt(index).setUnit(unit);
  }

  setGoalUnitsAt(index, goalUnits) {
    this.itemAt(index).setGoalUnits(goalUnits);
  }

  setAchievedUnitsAt(index, achievedUnits) {
    this.itemAt(index).setAchievedUnits(achievedUnits);
  }

  increaseAchievedUnitsAt(index) {
    this.itemAt(index).increaseAchievedUnits();
  }

  decreaseAchievedUnitsAt(index) {
    this.itemAt(index).decreaseAchievedUnits();
  }

  calculateScoreAt(index) {
    this.itemAt(index).calculateScore();
  }

  setScoreAt(index) {
    this.itemAt(index).setScore();
  }

  markGoalAchievedAt(index) {
    this.itemAt(index).markGoalAchieved();
  }

  setAchievedUnitsToZeroAt(index) {
    this.itemAt(index).setAchievedUnitsToZero();
  }

  addNotesAt(index, notes) {
    this.itemAt(index).addNotes(notes);
  }

  getTitleAt(index) {
    return this.itemAt(index).getTitle();
  }

  getCategoryAt(index) {
    return this.itemAt(index).getCategory();
  }

  getUnitAt(index) {
    return this.itemAt(index).getUnit();
  }

  getGoalUnitsAt(index) {
    return this.itemAt(index).getGoalUnits();
  }

  getAchievedUnitsAt(index) {
    return this.itemAt(index).getAchievedUnits();
  }

  getScoreAt(index) {
    return this.itemAt(index).getScore();
  }

  markAllGoalsAchieved() {
    this.forEach(habit => habit.markGoalAchieved());
  }

  calculateAllScores() {
    this.forEach(habit => habit.calculateScore());
  }

  setAllScores() {
    this.forEach(habit => habit.setScore());
  }

  sortHabitsAlphabetically() {
    this.habits.sort((firstHabit, secondHabit) => {
      let firstTitle = firstHabit.getTitle();
      let secondTitle = secondHabit.getTitle();

      if (firstTitle < secondTitle) {
        return - 1;
      } else if (firstTitle > secondTitle) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortHabitsByCategory() {
    this.habits.sort((firstHabit, secondHabit) => {
      let firstCategory = firstHabit.getCategory();
      let secondCategory = secondHabit.getCategory();
      let firstTitle = firstHabit.getTitle();
      let secondTitle = secondHabit.getTitle();

      if (firstCategory < secondCategory) {
        return - 1;
      } else if (firstCategory > secondCategory) {
        return 1;
      } else if (firstTitle < secondTitle) {
        return - 1;
      } else if (firstTitle > secondTitle) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  calculateTotalScore() {
    this.calculateAllScores();
    this.setAllScores();
    let numberOfHabits = this.size();
    let totalScore = 0;

    this.forEach(habit => totalScore += habit.getScore());

    return Math.round((totalScore / (numberOfHabits * 100)) * 100);
  }

  setTotalScore() {
    this.totalScore = this.calculateTotalScore();
  }

  getTotalScore() {
    return this.totalScore;
  }

  getAllFailedHabits() {
    this.setAllScores();
    return this.filter(habit => habit.getScore() === 0)
  }

  filterForCategory(category) {
    return this.filter(habit => habit.getCategory() === category);
  }

  getAllHabits() {
    return this.filter(_ => true);
  }

  toString() {
    return this.habits.map(habit => habit.toString()).join("\n");
  }

  _validateIndex(index) {
    if (!(index in this.habits)) {
      throw new ReferenceError(`Invalid index: ${index}`);
    }
  } 

}

module.exports = HabitTracker;



