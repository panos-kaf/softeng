const db = require('../utils/db');
const {parseDate} = require('../utils/date_conversion');
const fs = require("fs");
const csv = require("csv-parser");

exports.resetPasses = async(req, res, next) => {
    const filePath = "data/passes-sample.csv";

    try {
        const results = [];
        fs.createReadStream(filePath)
        .pipe(csv({ mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim() }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();
                await connection.query("DELETE FROM transactions");
                await connection.query("DELETE FROM tags");
                await connection.query("DELETE FROM settlements");
                await connection.query("DELETE FROM payments");

                const uniqueTags = new Map();
                results.forEach(row => {uniqueTags.set(row.tagRef, row.tagHomeID);});

                const tagHomeIDs = [...new Set(uniqueTags.values())];
                const operatorQuery = `SELECT id, op_id FROM operators WHERE op_id IN (?)`;
                const [operatorResults] = await connection.query(operatorQuery, [tagHomeIDs]);

                const operatorMap = new Map();
                operatorResults.forEach(row => {operatorMap.set(row.op_id, row.id);});
                
                const tagValues = [...uniqueTags.entries()].map(([tagRef, tagHomeID]) => {
                    const operator_id = operatorMap.get(tagHomeID);
                    return operator_id ? [tagRef, operator_id] : null;
                }).filter(Boolean);

                await connection.query(`INSERT INTO tags (tag_ref, operator_id) VALUES ?`, [tagValues]);  
                for (const row of results){
                const [tagRows] = await connection.query("SELECT id FROM tags WHERE tag_ref = ?", [row.tagRef]);
                const [tollRows] = await connection.query("SELECT id FROM toll_stations WHERE toll_id = ?", [row.tollID]);
            
                const tagID = tagRows.length > 0 ? tagRows[0].id : null;
                const tollID = tollRows.length > 0 ? tollRows[0].id : null;

                await connection.query(
                    `
                    INSERT INTO transactions (timestamp, charge, tag_id, toll_station_id)
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        row.timestamp,
                        parseFloat(row.charge), 
                        tagID,
                        tollID
                    ]);
                }
                await connection.commit();
                console.log("Passes have been reset");
                res.status(200).json({"status":"OK"});        

            } catch(error){
                await connection.rollback();
                console.error(error);
                res.status(500).json({"status":"failed","info":error.message});
            } finally {
                connection.release();
            }
        });
    } catch(error){
        console.error(error);
        res.status(500).send("An error occured while processing the CSV file");
    }
};