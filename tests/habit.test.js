"use strict"

let Habit = require("../lib/habit.js");

describe("Habit class", () => {
  test("Test valid string title", () => {
    let habit = new Habit("valid string title");
    expect(habit.getTitle()).toBe("valid string title");
  });

  test("Title cannot be a number", () => {
    expect(() => { new Habit(2)}).toThrow();
  });

  test("Title cannot be empty string", () => {
    expect(() => { new Habit("")}).toThrow();
  });

  test("Title cannot be string containing just whitespace", () => {
    expect(() => { new Habit(" ")}).toThrow();
  });

  test("Title can only contain alphabetic chars or whitespace", () => {
    expect(() => { new Habit("valid h8bit")}).toThrow();
  });

  test("Title is case insensitive", () => {
    let habit = new Habit("valid STRING title");
    expect(habit.getTitle()).toBe("valid string title");
  });

  test("Title cannot be a boolean", () => {
    expect(() => { new Habit(true)}).toThrow();
  });

  test("Title cannot be an object", () => {
    expect(() => { new Habit({})}).toThrow();
  });

  test("Category must be a string", () => {
    let habit = new Habit("valid string title");
    habit.setCategory("valid string category");
    expect(habit.getCategory()).toBe("valid string category");
  });

  test("Category cannot be empty string", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory("") }).toThrow();
  });

  test("Category cannot be a string containing just whitespace", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory(" ") }).toThrow();
  });

  test("Category cannot be a number", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory(123) }).toThrow();
  });

  test("Category cannot be a boolean", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory(true) }).toThrow();
  });

  test("Category cannot be an object", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory({}) }).toThrow();
  });

  test("Category can only contain alphabetic chars or whitespace", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setCategory("c2tegory")}).toThrow();
  });

  test("Unit must be a string", () => {
    let habit = new Habit("valid string title");
    habit.setUnit("valid string unit");
    expect(habit.getUnit()).toBe("valid string unit");
  });

  test("Unit cannot be empty string", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit("") }).toThrow();
  });

  test("Unit cannot be a string containing just whitespace", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit(" ") }).toThrow();
  });

  test("Unit cannot be a number", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit(123) }).toThrow();
  });

  test("Unit cannot be a boolean", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit(true) }).toThrow();
  });

  test("Unit cannot be an object", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit({}) }).toThrow();
  });

  test("Unit can only contain alphabetic chars or whitespace", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setUnit("un1t")}).toThrow();
  });

  test("goalUnits has to be a number", () => {
    let habit = new Habit("valid string title");
    habit.setGoalUnits(300);
    expect(habit.getGoalUnits()).toBe(300);
  });

  test("goalUnits cannot be NaN", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setGoalUnits(NaN)}).toThrow();
  });

  test("goalUnits cannot be less than 0", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setGoalUnits(-3)}).toThrow();
  });

  test("achievedUnits has to be a number", () => {
    let habit = new Habit("valid string title");
    habit.setAchievedUnits(10);
    expect(habit.getAchievedUnits()).toBe(10);
  });

  test("achievedUnits cannot be NaN", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setAchievedUnits(NaN)}).toThrow();
  });

  test("achievedUnits cannot be less than 0", () => {
    let habit = new Habit("valid string title");
    expect(() => { habit.setAchievedUnits(-10)}).toThrow();
  });

  test("increaseAchievedUnits increases achievedUnits by 1", () => {
    let habit = new Habit("valid string title");
    habit.setAchievedUnits(10);
    habit.increaseAchievedUnits();
    expect(habit.getAchievedUnits()).toBe(11);
  });

  test("decreaseAchievedUnits decreases achievedUnits by 1 down to min of 0", () => {
    let habit = new Habit("valid string title");
    habit.setAchievedUnits(10);
    habit.decreaseAchievedUnits();
    expect(habit.getAchievedUnits()).toBe(9);
  });

  test("If achievedUnits is 0, decreaseAchievedUnits will not change achievedUnits", () => {
    let habit = new Habit("valid string title");
    habit.setAchievedUnits(0);
    habit.decreaseAchievedUnits();
    expect(habit.getAchievedUnits()).toBe(0);
  });

  test("If goal is negative, and achievedUnits is 0 getScore will return 100", () => {
    let habit = new Habit("valid string title");
    habit.setGoalUnits(0);
    habit.setAchievedUnits(0);
    habit.setScore();
    expect(habit.getScore()).toBe(100);
  });

  test("If goal is negative, and achievedUnits is > 0, calculateScore will return 0", () => {
    let habit = new Habit("valid string title");
    habit.setGoalUnits(0);
    habit.setAchievedUnits(10);
    habit.setScore();
    expect(habit.getScore()).toBe(0);
  });

  
  test("If goal is positive, calculateScore will return a score based on the percentage of achieved units / goal units", () => {
    let habit = new Habit("valid string title");
    habit.setGoalUnits(10);
    habit.setAchievedUnits(6);
    habit.setScore();
    expect(habit.getScore()).toBe(60);
  });

  test("If goal is positive, and achievedUnits > goalUnits, score === 100", () => {
    let habit = new Habit("valid string title");
    habit.setGoalUnits(10);
    habit.setAchievedUnits(12);
    habit.setScore();
    expect(habit.getScore()).toBe(100);
  });

  test("toString returns a formatted string", () => {
    let habit = new Habit("do yoga");

    habit.setGoalUnits(20);
    habit.setUnit("minutes");
    habit.setAchievedUnits(18);
    habit.setScore();

    expect(habit.toString()).toBe("HABIT: do yoga || GOAL: 20 minutes per day || SCORE TODAY: 90%");
    
  });
});
