import express from "express"
import { createGadgetController, deleteGadgetController, getAllGadgetsController, selfDestructController, updateGadgetController } from "../controllers/gadgets.controller.js";

const gadgetRouter = express.Router()


gadgetRouter.post("/", createGadgetController)
gadgetRouter.get("/", getAllGadgetsController)
gadgetRouter.patch("/", updateGadgetController)
gadgetRouter.delete("/", deleteGadgetController)
gadgetRouter.post("/:id/self-destruct", selfDestructController)



export default gadgetRouter;