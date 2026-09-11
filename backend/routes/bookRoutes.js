const express=require("express")
const{
    getBooks,
    getBookById,
    searchBooks,
    getBooksByGenre
}=require("../controllers/bookControllers.js");
const router = express.Router();
router.get("/",getBooks);
router.get("/search",searchBooks);
router.get("/genre/:genre",getBooksByGenre);
router.get("/:id",getBookById)
module.exports=router;
