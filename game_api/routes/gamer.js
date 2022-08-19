const express = require("express");
const router = express.Router();
const connection = require("../db");
const idLength = 10;

/**
 * @swagger
 * components:
 *    schemas:
 *       gamer:
 *          type: object
 *          required:
 *              - gname
 *              - city
 *          properties:
 *             id:
 *                type : string
 *                description : "the auto-generated id of the player"
 *             gname:
 *                type : string
 *                description : "The player name"
 *             city:
 *                type : string
 *                description : "The player city"
 *          example:
 *              id:1
 *              gname:mani
 *              city:karur
 */

/**
 * @swagger
 * /gamer:
 *    get:
 *      summary : Return the list of all players
 *      responses:
 *           200:
 *              description: The list of the players
 *              content:
 *                 application/json:
 *                     schema:
 *                        type: array
 *                        $ref: '#/components/schema/players'
 */

router.get("/", (req,res) => {
    const players = req.app.db.get("gamer")

    res.send(players)
});

/**
 * @swagger
 * /gamer/{id}:
 *   get:
 *      summary : Get the player br id
 *      parameters:
 *          - in : path
 *            name : id
 *            schema:
 *               type:string
 *            required : true
 *            description : The player id
 *      responses:
 *          200:
 *             description : The player description by id
 *             contents:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/players'
 *          404:
 *             description : The player not found
 */

router.get("/:id", (req,res) => {
    const players = req.app.db.get("gamer").find({ id: req.params.id }).value()

    if(!players){
        res.sendStatus(404)
    }
    res.send(players)
});

/**
 * @swagger
 * /gamer:
 *  post:
 *     summary : Create a new player
 *     requestbody:
 *           required : true
 *           content:
 *               application/json:
 *                  schema:
 *                     type: object
 *                     $ref: '#/components/schemas/players'
 *     responses:
 *       200:
 *         description : The player was succesfully created
 *         content:
 *            application/json:
 *               schema:
 *                  $ref: '#/components/schema/players'
 *       500:
 *         description : Some server error
 */
router.post("/", (req,res) => {
    try{
        const players = {
            id: nanoid(idLength),
            ...req.body
        }

        req.app.db.get("gamer").push(players).write()

        res.send(players)
    } catch (error) {
        return res.status(500).send(error)
    }
    });

/**
 * @swagger
 * /gamer/{id}:
 *  put:
 *     summary : Update the player by the id
 *     parameters:
 *       - in : path
 *         name : id
 *         schema:
 *             type : string
 *         required : true
 *         description : The player id
 *     requestBody:
 *       required : true
 *       content:
 *         application/json:
 *            schema:
 *              $ref: '#/components/schemas/players'
 *     responses:
 *        200:
 *          description : The player was sussessfully updated
 *          content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/players'
 *        404:
 *          description : The player was not found
 *        500:
 *          description : some error
 */

router.put("/:id" , (req,res) => {
    try{
        req.app.db.get("gamer").find({ id: req.params.id }).assign(req.body).write()

        res.send(req.app.db.get("gamer").find({id:req.params.id}))
    } catch(error){
        return res.status(500).send(error)
    }
});

/**
 * @swagger
 * /gamer/{id}:
 *  delete:
 *       summary : Remove the player id
 *       parameters:
 *           - in : path
 *             name : id
 *             schema:
 *               type : string
 *             required : true
 *             description : The players id
 *       responses:
 *         200:
 *           description : The player id was successfully deleted
 *         404:
 *           description : The player was not found
 */

router.delete("/:id",(req,res)=>{
    req.app.db.get("gamer").remove({ id:req.params.id }).write()

    res.sendStatus(200)
})

module.exports = router;