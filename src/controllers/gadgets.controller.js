
import pool from "../db/connectDB.js";
import ApiResponse from "../utils/apiResponse.js";


const adjectives = ["Mighty", "Stealthy", "Swift", "Silent", "Thunderous", "Vengeful", "Fierce", "Ancient", "Radiant", "Shadow"];
const animals = ["Nightingale", "Kraken", "Eagle", "Phoenix", "Tiger", "Dragon", "Wolf", "Leopard", "Falcon", "Viper"];


const generateConfirmationCode = ()=>{
    let randomCode = "xxxxxx".replace(/[x]/g, () =>
        ((Math.random() * 36) | 0)
    );
    return randomCode;
}

const generateRandomCodename = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `The ${adjective} ${animal}`;
};

const createGadgetController = async (req, res) => {
    const { name, status } = req.body;
    console.log(req.query);
    try {
        const newAsset = await pool.query(
            'INSERT INTO assets (name, status, codename, updated_at, created_at) VALUES ($1, $2, $3,Now(), Now()) RETURNING *;',
            [name, status || "Available" ,generateRandomCodename()]
        );
        res.status(201).json(new ApiResponse(201, newAsset.rows[0], "Successfully created new gadget"));
    } catch (err) {
        console.error(err.message);
        res.status(500).send(new ApiResponse(500, null, "Server Error"));
    }
};

const getAllGadgetsController = async (req, res)=>{
    const {status} = req.query

    if (!status){
        try {
            const allAssets = await pool.query('SELECT * FROM assets');
            const gadgets = allAssets.rows
            const modifiedGadgets = gadgets.map((gadget)=>{
                const probability = Math.floor(Math.random() * 101)
                return {
                    ...gadget,
                    mission_success_probability: `${probability}%` 
                };
            }); 
            res.status(200).send(new ApiResponse(200, modifiedGadgets, "Retrived Successfully"))
            console.log("All Assets in Table: ", allAssets.rows);
        } catch (error) {
            res.status(500).send(new ApiResponse(500, null, "Server Error"))
        }
    }else{
        try {
            const allAssets = await pool.query('SELECT * FROM assets where status=$1',[status]);
            res.status(200).send(new ApiResponse(200, allAssets.rows, "Retrived Successfully"))
            console.log("All Assets in Table: ", allAssets.rows);
        } catch (error) {
            res.status(500).send(new ApiResponse(500, null, "Server Error"))
        }
    }
}

const updateGadgetController = async (req, res) => {
    const { name, status, codename } = req.body; // Extract values to update

    try {
        const specificGadget = await pool.query('SELECT * FROM assets WHERE name = $1', [name]);
        if (specificGadget.rows.length === 0) {
            return res.status(404).send(new ApiResponse(404, null, "No gadget found with the given name"));
        }
        const existingGadget = specificGadget.rows[0]; 
        const updatedStatus = status || existingGadget.status;
        const updatedCodename = codename || existingGadget.codename;

        const updatedGadget = await pool.query(
            `UPDATE assets 
             SET status = $1, codename = $2, updated_at = NOW()
             WHERE name = $3
             RETURNING *;`,
            [updatedStatus, updatedCodename, name]
        );
        res.status(200).send(new ApiResponse(200, updatedGadget.rows[0], "Updated Successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).send(new ApiResponse(500, null, "Error updating gadget"));
    }
};
const deleteGadgetController = async (req, res) => {
    const { name } = req.body;
    try {
        const specificGadget = await pool.query('SELECT * FROM assets WHERE name = $1', [name]);
        if (specificGadget.rows.length === 0) {
            return res.status(404).send(new ApiResponse(404, null, "No gadget found with the given name"));
        }
        const updatedStatus = "Decommissioned"
        const updatedGadget = await pool.query(
            `UPDATE assets 
             SET status = $1, updated_at=NOW()
             WHERE name = $2
             RETURNING *;`,
            [updatedStatus,name]
        );
        res.status(200).send(new ApiResponse(200, updatedGadget.rows[0], "Decommissioned Successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).send(new ApiResponse(500, null, "Error updating gadget"));
    }
};

const selfDestructController = async (req, res)=>{
    const {id }=req.params;
    
    try {
        const gadgetQuery = await pool.query("SELECT * FROM assets WHERE id = $1", [id]);

        if (gadgetQuery.rows.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "Gadget not found"));
        }
        const generatedCode = generateConfirmationCode()
        console.log(generatedCode);
        res.status(200).json(new ApiResponse(200, `generated Code is ${generatedCode}`,"Self Destruct mode activated!!"))
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiResponse(500, null, "Error triggering self-destruct sequence"));
    
    }
}
export { createGadgetController,selfDestructController, getAllGadgetsController,deleteGadgetController, updateGadgetController };

