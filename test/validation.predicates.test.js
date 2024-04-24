import predicate from "predicate";
import { listInvalidPredicates } from "../src/validation";
import {test, expect} from "vitest";

let schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
  },
};

test("Check predicates", () => {
  const conditions = [{ firstName: "somePredicate" }];

  expect(listInvalidPredicates(conditions, schema)).toEqual(["somePredicate"]);

  predicate.somePredicate = function() {
    return false;
  };

  expect(listInvalidPredicates(conditions, schema)).toEqual([]);
});
