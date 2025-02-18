import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const gadgetSchema = new mongoose.Schema({
    id: {
        type: String, 
        default: uuidv4, 
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is Mandatory"]
    },
    status: {
        type: String,
        enum: ["Available", "Deployed", "Destroyed", "Decommissioned"],
        default: "Available" 
    }
}, {timestamps:true});

const Gadget = mongoose.model("Gadget", gadgetSchema);

export default Gadget;
