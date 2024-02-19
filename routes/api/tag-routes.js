const router = require("express").Router();
const { Tag, Product } = require("../../models");

// Middleware to handle errors
const errorHandler = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

// GET all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tags);
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET one tag by ID
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (err) {
    errorHandler(res, err);
  }
});

// POST create new tag
router.post("/", async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ error: "Tag name is required" });
    }
    const newTag = await Tag.create({ tag_name });
    res.status(201).json(newTag);
  } catch (err) {
    errorHandler(res, err);
  }
});

// PUT update tag by ID
router.put("/:id", async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ error: "Tag name is required" });
    }
    const updatedTag = await Tag.update(
      { tag_name },
      { where: { id: req.params.id } }
    );
    res.status(200).json(updatedTag);
  } catch (err) {
    errorHandler(res, err);
  }
});

// DELETE one tag by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Tag.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
});

module.exports = router;