// src/test/tagController.test.js
const { getTags, createTag } = require("../../src/controllers/TagController");
const Tag = require("../models/TagModel");
const httpMocks = require("node-mocks-http");

jest.mock("../models/TagModel");

describe("Tag Controller", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  // ----------------------------
  // GET TAGS
  // ----------------------------
  describe("getTags", () => {
    it("should return 200 and all tags", async () => {
      const mockTags = [{ name: "wifi" }, { name: "parking" }];
      Tag.find.mockResolvedValue(mockTags);

      await getTags(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockTags);
    });

    it("should return 500 if there is an error", async () => {
      Tag.find.mockRejectedValue(new Error("DB Error"));

      await getTags(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        message: "Failed to fetch tags",
        error: "DB Error",
      });
    });
  });

  // ----------------------------
  // CREATE TAG
  // ----------------------------
  describe("createTag", () => {
    it("should return 400 if name is missing", async () => {
      req.body = {}; // no name

      await createTag(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: "Tag name is required",
      });
    });

    it("should create a tag and return 201", async () => {
      req.body = { name: "wifi" };
      const saveMock = jest.fn().mockResolvedValue();
      Tag.mockImplementation(() => ({
        save: saveMock,
        name: "wifi"
      }));

      await createTag(req, res);

      expect(res.statusCode).toBe(201);
      const data = res._getJSONData();
      expect(data.message).toBe("Tag created successfully");
      expect(data.tag.name).toBe("wifi");
    });

    it("should return 500 if creation fails", async () => {
      req.body = { name: "wifi" };
      Tag.mockImplementation(() => {
        throw new Error("Create failed");
      });

      await createTag(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        message: "Error creating tag",
      });
    });
  });
});
