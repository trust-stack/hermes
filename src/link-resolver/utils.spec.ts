import { parseUrlPath } from "./utils";

describe("utils", () => {
  describe("parseUrlPath", () => {
    it("can identify the primary qualifier and primary identifier.", () => {
      const results = parseUrlPath("/01/09524000059109");

      expect(results[0]).toEqual({
        qualifier: "01",
        identifier: "09524000059109",
      });
    });

    it("can identify primary, and deeply nested qualifiers and identifiers.", () => {
      const results = parseUrlPath("/01/09524000059109/21/1234");

      expect(results).toEqual([
        {
          qualifier: "01",
          identifier: "09524000059109",
        },
        {
          qualifier: "21",
          identifier: "1234",
        },
      ]);
    });

    it("can ignore arbitrary query strings.", () => {
      const results = parseUrlPath("/01/09524000059109/21/1234?foo=bar");

      expect(results).toEqual([
        {
          qualifier: "01",
          identifier: "09524000059109",
        },
        {
          qualifier: "21",
          identifier: "1234",
        },
      ]);
    });

    it("will ignore odd segments", () => {
      const results = parseUrlPath("/01/09524000059109/21/1234/123?foo=bar");

      expect(results).toEqual([
        {
          qualifier: "01",
          identifier: "09524000059109",
        },
        {
          qualifier: "21",
          identifier: "1234",
        },
      ]);
    });
  });
});
