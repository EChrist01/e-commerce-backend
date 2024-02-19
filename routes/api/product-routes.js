const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Middleware to handle errors
const errorHandler = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(products);
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET one product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    errorHandler(res, err);
  }
});

// POST create new product
router.post("/", async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    const newProduct = await Product.create({
      product_name,
      price,
      stock,
    });

    if (tagIds && tagIds.length) {
      const productTags = tagIds.map(tagId => ({ product_id: newProduct.id, tag_id: tagId }));
      await ProductTag.bulkCreate(productTags);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    errorHandler(res, err);
  }
});

// PUT update product by ID
router.put("/:id", async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    await Product.update({ product_name, price, stock }, { where: { id: req.params.id } });

    if (tagIds && tagIds.length) {
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      const productTags = tagIds.map(tagId => ({ product_id: req.params.id, tag_id: tagId }));
      await ProductTag.bulkCreate(productTags);
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
});

// DELETE one product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Product.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
});

module.exports = router;