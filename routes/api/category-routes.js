const router = require("express").Router();
const { Category, Product } = require("../../models");

// Error handler middleware
const errorHandler = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: { model: Product },
    });
    res.status(200).json(categories);
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: Product },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    errorHandler(res, err);
  }
});

// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const newCategory = await Category.create({ category_name });
    res.status(201).json(newCategory);
  } catch (err) {
    errorHandler(res, err);
  }
});

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const [updatedRows] = await Category.update(
      { category_name },
      { where: { id: req.params.id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
});

module.exports = router;