import conditionsMeet from "../src/conditionsMeet";
import { testInProd } from "./utils";
import {test, expect} from "vitest";

test("sanity checkField", function() {
  expect(() => conditionsMeet("empty", {})).toThrow();
  expect(() => conditionsMeet({}, 0)).toThrow();
});

test("run predicate against array and elements", () => {
  let condition = {
    options: "empty",
  };
  expect(conditionsMeet(condition, [""])).toBeTruthy();
  expect(conditionsMeet(condition, [])).toBeTruthy();
});

test("handles array of non-objects", () => {
  let condition = {
    options: {
      contains: "foo",
    },
  };
  expect(conditionsMeet(condition, { options: ["bar"] })).toBeFalsy();
  expect(conditionsMeet(condition, { options: [] })).toBeFalsy();
  expect(conditionsMeet(condition, { options: ["foo", "bar"] })).toBeTruthy();
});

// throws error
test("handles array of numbers", () => {
  let condition = {
    options: {
      contains: 2,
    },
  };
  expect(conditionsMeet(condition, { options: [1, 2] })).toBeTruthy();
  expect(conditionsMeet(condition, { options: [1] })).toBeFalsy();
  expect(conditionsMeet(condition, { options: [] })).toBeFalsy();
});

test("single line", () => {
  let condition = {
    firstName: "empty",
  };
  expect(conditionsMeet(condition, {})).toBeTruthy();
  expect(conditionsMeet(condition, { firstName: "some" })).toBeFalsy();
  expect(conditionsMeet(condition, { firstName: "" })).toBeTruthy();
  expect(conditionsMeet(condition, { firstName: undefined })).toBeTruthy();
});

test("default use and", () => {
  let condition = {
    firstName: {
      equal: "Will",
    },
    lastName: {
      equal: "Smith",
    },
  };
  expect(conditionsMeet(condition, { firstName: "Will" })).toBeFalsy();
  expect(conditionsMeet(condition, { lastName: "Smith" })).toBeFalsy();
  expect(
    conditionsMeet(condition, { firstName: "Will", lastName: "Smith" })
  ).toBeTruthy();
});

test("NOT condition", () => {
  let condition = {
    not: {
      firstName: {
        equal: "Will",
      },
    },
  };
  expect(conditionsMeet(condition, { firstName: "Will" })).toBeFalsy();
  expect(conditionsMeet(condition, { firstName: "Smith" })).toBeTruthy();
  expect(
    conditionsMeet(condition, { firstName: "Will", lastName: "Smith" })
  ).toBeFalsy();
});

test("invalid condition", () => {
  expect(() => conditionsMeet("empty", {})).toThrow();
  expect(() => conditionsMeet({}, "empty")).toThrow();
  expect(testInProd(() => conditionsMeet("empty", {}))).toBeFalsy();
  expect(testInProd(() => conditionsMeet({}, "empty"))).toBeFalsy();
});
