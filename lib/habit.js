const nextId = require("./next-id");

class Habit {
  constructor(title) {
    if (this.invalidInput(title, "string")) {
      throw new Error("Please enter a valid title");
    }
    this.id = nextId();
    this.title = this.formatStringInput(title);
    this.category = "";
    this.positiveGoal = true;
    this.unit = "";
    this.goalUnits = 0;
    this.achievedUnits = 0;
    this.score = 0;
    this.notes = "";
  }

  invalidInput(input, type) {
    if (type === "number") {
      return typeof input !== type || isNaN(input) || input < 0;
    } else if (type === "string") {
      return typeof input !== type || input.length === 0;
    } else {
      return true;
    }
  }

  formatStringInput(input) {
    return input.trim().toLowerCase();
  }

  setTitle(title) {
    if (this.invalidInput(title, "string")) {
      throw new Error("Please enter a valid title");
    } else {
      this.title = this.formatStringInput(title);
    }
  }

  setCategory(category) {
    if (this.invalidInput(category, "string")) {
      throw new Error("Please enter a valid category");
    }
    this.category = this.formatStringInput(category);
  }

  setUnit(unit) {
    if (this.invalidInput(unit, "string")) {
      throw new Error("Please enter a valid unit, e.g. times, pages, steps");
    }
    this.unit = this.formatStringInput(unit);
  }

  setGoalUnits(number) {
    if (this.invalidInput(number, "number")) {
      throw new Error("Please enter a valid number");
    }
    if (number === 0) {
      this.positiveGoal = false;
    }
    this.goalUnits = number;
  }

  setAchievedUnits(number) {
    if (this.invalidInput(number, "number")) {
      throw new Error("Please enter a valid number");
    }
    this.achievedUnits = number;
  }

  increaseAchievedUnits() {
    this.achievedUnits += 1;
  }

  decreaseAchievedUnits() {
    this.achievedUnits -= 1;
    if (this.achievedUnits < 0) {
      this.achievedUnits = 0;
    }
  }

  calculateScore() {
    if (!this.positiveGoal) {
      return this.achievedUnits !== 0 ? 0 : 100;
    } else {
      let score = Math.round((this.achievedUnits / this.goalUnits) * 100);
      return score > 100 ? 100 : score;
    }
  }

  setScore() {
    this.score = this.calculateScore();
  }

  addNotes(text) {
    if (this.notes) {
      this.notes += `\n ${text.trim()}\n`;
    } else {
      this.notes = `\n ${text.trim()}\n`;
    }
  }

  resetNotes(text) {
    this.notes = text;
  }

  markGoalAchieved() {
    this.achievedUnits = this.goalUnits;
  }

  setAchievedUnitsToZero() {
    this.achievedUnits = 0;
  }

  getTitle() {
    return this.title;
  }

  getUnit() {
    return this.unit;
  }

  getCategory() {
    return this.category;
  }

  getPositiveGoal() {
    return this.positiveGoal;
  }

  getGoalUnits() {
    return this.goalUnits;
  }

  getAchievedUnits() {
    return this.achievedUnits;
  }

  getScore() {
    return this.score;
  }

  getNotes() {
    return this.notes;
  }

  toString() {
    return `HABIT: ${this.title} || GOAL: ${this.goalUnits} ${this.unit} per day || SCORE TODAY: ${this.score}%`;
  }

  static makeHabit(rawHabit) {
    let habit = new Habit(rawHabit.title);
    habit.id = rawHabit.id;
    habit.category = rawHabit.category;
    habit.positiveGoal = rawHabit.positiveGoal;
    habit.unit = rawHabit.unit;
    habit.goalUnits = rawHabit.goalUnits;
    habit.achievedUnits = rawHabit.achievedUnits;
    habit.score = rawHabit.score;
    habit.notes = rawHabit.notes;
    return habit;
  }
}

module.exports = Habit;
