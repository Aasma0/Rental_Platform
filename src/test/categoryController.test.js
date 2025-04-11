// src/test/categoryController.test.js
const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
  } = require("../../src/controllers/categoryController");
  const Category = require("../models/categoryModel");
  const httpMocks = require("node-mocks-http");
  
  jest.mock("../models/categoryModel");
  
  describe("Category Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });
  
    // ----------------------------
    // ADD CATEGORY
    // ----------------------------
    describe("addCategory", () => {
      it("should return 400 if name or description is missing", async () => {
        req.body = { name: "New Category" }; // missing description
  
        await addCategory(req, res);
  
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ msg: "All fields are required" });
      });
  
      it("should return 400 if category already exists", async () => {
        req.body = { name: "Existing Category", description: "A description" };
        Category.findOne.mockResolvedValue({ name: "Existing Category" });
  
        await addCategory(req, res);
  
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ msg: "Category already exists" });
      });
  
      it("should add a new category and return 201", async () => {
        req.body = { name: "New Category", description: "A description" };
        Category.findOne.mockResolvedValue(null); // No existing category
        const saveMock = jest.fn().mockResolvedValue();
        Category.mockImplementation(() => ({
          save: saveMock,
        }));
  
        await addCategory(req, res);
  
        expect(res.statusCode).toBe(201);
        const data = res._getJSONData();
        expect(data.msg).toBe("Category added successfully");
        expect(data.category).toBeDefined();
      });
  
      it("should return 500 if an error occurs", async () => {
        req.body = { name: "New Category", description: "A description" };
        Category.findOne.mockRejectedValue(new Error("Database error"));
  
        await addCategory(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ msg: "Database error" });
      });
    });
  
    // ----------------------------
    // GET CATEGORIES
    // ----------------------------
    describe("getCategories", () => {
      it("should return 200 and all categories", async () => {
        const mockCategories = [
          { name: "Category 1", description: "Description 1" },
          { name: "Category 2", description: "Description 2" },
        ];
        Category.find.mockResolvedValue(mockCategories);
  
        await getCategories(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
          msg: "category fetched successfully",
          categories: mockCategories,
        });
      });
  
      it("should return 500 if an error occurs", async () => {
        Category.find.mockRejectedValue(new Error("Database error"));
  
        await getCategories(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ msg: "Database error" });
      });
    });
  
   
    // ----------------------------
    // UPDATE CATEGORY
    // ----------------------------
    describe("updateCategory", () => {
      it("should return 400 if name or description is missing", async () => {
        req.body = { name: "Updated Category" }; // missing description
        req.params.id = "1";
  
        await updateCategory(req, res);
  
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ msg: "All fields are required" });
      });
  
      it("should return 404 if category is not found", async () => {
        req.body = { name: "Updated Category", description: "Updated description" };
        req.params.id = "1";
        Category.findByIdAndUpdate.mockResolvedValue(null);
  
        await updateCategory(req, res);
  
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ msg: "Category not found" });
      });
  
      it("should update the category and return 200", async () => {
        req.body = { name: "Updated Category", description: "Updated description" };
        req.params.id = "1";
        const mockCategory = { name: "Old Category", description: "Old description" };
        Category.findByIdAndUpdate.mockResolvedValue({
          ...mockCategory,
          ...req.body,
        });
  
        await updateCategory(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
          msg: "Category updated successfully",
          category: { name: "Updated Category", description: "Updated description" },
        });
      });
  
      it("should return 500 if an error occurs", async () => {
        req.body = { name: "Updated Category", description: "Updated description" };
        req.params.id = "1";
        Category.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));
  
        await updateCategory(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ msg: "Database error" });
      });
    });
  
    // ----------------------------
    // DELETE CATEGORY
    // ----------------------------
    describe("deleteCategory", () => {
      it("should return 404 if category is not found", async () => {
        req.params.id = "1";
        Category.findByIdAndDelete.mockResolvedValue(null);
  
        await deleteCategory(req, res);
  
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ msg: "Category not found" });
      });
  
      it("should delete the category and return 200", async () => {
        req.params.id = "1";
        Category.findByIdAndDelete.mockResolvedValue({ name: "Category to delete" });
  
        await deleteCategory(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ msg: "Category deleted successfully" });
      });
  
      it("should return 500 if an error occurs", async () => {
        req.params.id = "1";
        Category.findByIdAndDelete.mockRejectedValue(new Error("Database error"));
  
        await deleteCategory(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ msg: "Database error" });
      });
    });
  });
  