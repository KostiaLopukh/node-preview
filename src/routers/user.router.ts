import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.findAll);

router.post("/", userController.create);

router.put("/:id", userController.updateById);

router.delete("/:id", userController.deleteById);

export const userRouter = router;
