const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Importing objects
const utils = require("../../helpers/utils.helper.js");
const database = require("../../models/sqlite.model.js");
const user = require("../../models/user.model.js");
const tag = require("../../models/tag.model.js");

/**
 * GET requests
 * Get all tags
 * @return 200 OK
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.get("/", (req, res, next) => {
    const token = req.headers.authorization;
    user.validate(token).then(
        decoded => {
            tag.getAll(decoded.sub).then(
                results => {
                    console.log("OK: GET /tag");
                    res.status(200).json(results);
                },
                error => {
                    console.log("ERROR: GET /tag ::", error.message);
                    res.status(500).json({
                        type: "ERROR",
                        message: "Internal Server Error"
                    });
                },
            );
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: GET /tag ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /tag :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * GET requests
 * Get tag with ID
 * @return 200 OK
 * @return 204 No Content
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/:tagId", (req, res, next) => {
    const token = req.headers.authorization;
    const tagId = req.params.tagId;
    user.validate(token).then(
        decoded => {
            if(tagId === undefined || tagId === null || !utils.numRegex(tagId)) {
                console.log("ERROR: GET /tag/:tagId :: tag id is invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "tag id is invalid"
                });
            } else {
                console.log("INFO: GET /tag/:tagId :: tagId is " + tagId);
                tag.getTagById(decoded.sub, tagId).then(
                    result => {
                        if(result != null) {
                            console.log("OK: GET /tag/:tagId");
                            res.status(200).json(result);
                        } else {
                            console.log("OK: GET /tag/:tagId :: No tag found with the id " + tagId);
                            res.sendStatus(204);
                        }
                    },
                    error => {
                        console.log("ERROR: GET /tag/:tagId ::", error.message);
                        res.status(500).json({
                            type: "ERROR",
                            message: "Internal Server Error"
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: GET /tag/:tagId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /tag/:tagId :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * POST requests
 * SAVE tag
 * @return 201 Created
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.post("/", (req, res, next) => {
    const token = req.headers.authorization;
    const tagName = utils.stripString(req.body.tag);
    user.validate(token).then(
        decoded => {
            /**
             * @todo Remove obsolete spaces and line breaks
             *
             * @todo Remove all leading/ending space from tag
             *       Remove all new lines (\n) from tag
             * @todo Remove all leading/ending space from description
             *       Remove alle multiple new lines and spaces from description
             */
            let valid = (tagName === null || tagName === undefined || utils.empty(tagName) || !utils.wordRegex(tagName));
            if(valid) {
                console.log("ERROR: POST /tag :: tag name is invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "tag name is invalid"
                });
            } else {
                console.log("INFO: POST /tag :: Inserting tag");
                tag.insertTag({ userId: decoded.sub, tag: tagName }).then(
                    insertedId => {
                        tag.getTagById(decoded.sub, insertedId).then(
                            result => {
                                if(result != null) {
                                    console.log("OK: POST /tag :: Inserted tag with id " + insertedId);
                                    res.status(201).json(result);
                                } else {
                                    console.log("ERROR: POST /tag :: No inserted tag found with the id " + insertedId);
                                    res.status(500).json({
                                        type: "ERROR",
                                        message: "No inserted tag found with the id " + id
                                    });
                                }
                            },
                            error => {
                                console.log("ERROR: POST /tag ::", error.message);
                                res.status(500).json({
                                    type: "ERROR",
                                    message: "Internal Server Error"
                                });
                            },
                        );
                    },
                    error => {
                        console.log("ERROR: POST /tag ::", error.message);
                        res.status(500).json({
                            type: "ERROR",
                            message: "Internal Server Error"
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: POST /tag ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /tag :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * PATCH requests
 * Patch tag with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 404 Not Found
 * @return 500 Internal Server Error
 */
router.post("/:tagId", (req, res, next) => {
    const token = req.headers.authorization;
    const tagId = req.params.tagId;
    const tagName = utils.stripString(req.body.tag);
    user.validate(token).then(
        decoded => {
            /**
             * @todo Remove obsolete spaces and line breaks
             *
             * @todo Remove all leading/ending space from tag
             *       Remove all new lines (\n) from tag
             * @todo Remove all leading/ending space from description
             *       Remove alle multiple new lines and spaces from description
             */
             let valid = (tagId === null || tagId === undefined || !utils.numRegex(tagId) ||
                         tagName === null || tagName === undefined || utils.empty(tagName) || !utils.wordRegex(tagName));
            if(valid) {
                console.log("ERROR: POST /tag/:tagId :: tag id or name are invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "tag id or name are invalid"
                });
            } else {
                console.log("INFO: POST /tag/:tagId :: Updating tag");
                tag.updateTag({ id: tagId, userId: decoded.sub, tag: tagName }).then(
                    updatedId => {
                        console.log("OK: POST /tag/:tagId :: Updated tag with id " + tagId);
                        res.status(200).json({
                            id: parseInt(tagId),
                            userId: decoded.sub,
                            tag: tagName
                        });
                    },
                    error => {
                        console.log("ERROR: POST /tag/:tagId ::", error.message);
                        res.status(404).json({
                            type: "ERROR",
                            message: error.message
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: POST /tag/:tagId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /tag/:tagId :: An unexpected error has occurred ::", error.message);
    });
});

module.exports = router;
