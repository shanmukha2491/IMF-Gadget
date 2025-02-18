import express from "express"
import gadgetRouter from "./gadgets.routes.js"

const indexRouter = express.Router()

indexRouter.use("/gadgets", gadgetRouter)

export default indexRouter