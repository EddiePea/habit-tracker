const nextId = require("./next-id");
const MAX_SCORE = 100;

class Habit {

  constructor(title) {
    //Raises an error if the initial habit title is invalid
    if (this.invalidInput(title, "string")) {
      throw new Error("Please enter a valid title");
    } 

    this.id = nextId();
    this.title = this.formatStringInput(title);
    this.category = "";
    //This property indicates whether the goal is to do something (positive goal) or not do something (negative goal)
    this.positiveGoal = true;
    this.unit = "";
    //Currently the app is designed to operate on a daily goal basis
    //However, the generic name allows room for future change to weekly and monthly goals
    this.goalUnits = 0;
    this.achievedUnits = 0;
    this.score = 0;
    this.notes = 0;
  }

  //Returns true if: number input is not expected OR is NaN
  //or string input is not exepcted OR has 0 length OR contains chars other than alphabetic, whitespace and other regularly used special chars
  //or other data types are input, e.g. boolean                
  invalidInput(input, type) {
    if (type === "number") {
      return typeof input !== type || (isNaN(input)) || input < 0;
    } else if (type === "string") {
      return typeof input !== type || input.length === 0;
    } else {
      return true;
    }
  }

  //Trims whitespace from strings and sets all chars to lowercase
  formatStringInput(input) {
    return input.trim().toLowerCase();
  }

  //Validates the input then changes the title of the habit 
  setTitle(title) {
    if (this.invalidInput(title, "string")) {
      throw new Error("Please enter a valid title");

    } else {
      this.title = this.formatStringInput(title);
    }
  }

  //Validates the input then changes the habit's category
  setCategory(category) {
    if (this.invalidInput(category, "string")) {
      throw new Error("Please enter a valid category");
    }
    this.category = this.formatStringInput(category);
  }

  //Validates the input then changes the habit's unit
  setUnit(unit) {
    if (this.invalidInput(unit, "string")) {
      throw new Error("Please enter a valid unit, e.g. times, pages, steps");
    }
    this.unit = this.formatStringInput(unit);
  }

  //validates the input then changes the habit's goalUnits number
  setGoalUnits(number) {
    if (this.invalidInput(number, "number")) {
      throw new Error("Please enter a valid number");
    }

    if(number === 0) {
      this.positiveGoal = false;
    }

    this.goalUnits = number;
  }

  //Validates the input then changes the habit's number of achieved units
  setAchievedUnits(number) {
    if (this.invalidInput(number, "number")) {
      throw new Error("Please enter a valid number");
    }
    this.achievedUnits = number;
  }

  //Increases the number of achieved units by 1
  increaseAchievedUnits() {
    this.achievedUnits += 1;

  }

  //Decreases the number of achieved units by 1
  decreaseAchievedUnits() {
    this.achievedUnits -= 1;

    if (this.achievedUnits < 0) {
      this.achievedUnits = 0;
    }
  }

  //Calculates score as a percentage of achieved units v goal units
  //Score cannot exceed 100
  //If the goal is negative (i.e. do not do x) then > 0 achieved units will give a score of 100
  //and anything over 0 will give a score of 0
  calculateScore() {

    if (!this.positiveGoal) {
      return this.achievedUnits !== 0 ? 0 : 100; 
      
    } else {
      let score = Math.round((this.achievedUnits / this.goalUnits) * 100);
      return score > MAX_SCORE ? MAX_SCORE : score;
    }
  }

  //Sets the score property to the calculated score number
  setScore() {
    this.score = this.calculateScore();
  }

  addNotes(text) {
    this.notes += text;
  }

  //Sets achievedUnits to goalUnits to indicate that all goal units have been achieved
  markGoalAchieved() {
    this.achievedUnits = this.goalUnits;
  }

  //Sets achievedUnits to zero to indicate that no units have been achieved
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

}

module.exports = Habit;




