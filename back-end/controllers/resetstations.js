const db = require("../utils/db");
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');
const fs = require("fs");
const csv = require("csv-parser");

exports.resetStations = async (req, res, next) => {
  const filePath = "data/stations.csv";

  try {
    const results = [];
//test
    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim() }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const connection = await db.getConnection(); // Use db utility to get the connection

        try {
          await connection.beginTransaction();
          await connection.query("DELETE FROM transactions");
          await connection.query("DELETE FROM tags");
          await connection.query("DELETE FROM toll_stations");
          await connection.query("DELETE FROM operators");

          const uniqueOps = results.reduce((acc, row) => {
              if (!acc.some(op => op.OpID === row.OpID))
                  acc.push(row);
              return acc;
          }, []); 

          const operators = uniqueOps.map(row => [row.OpID, row.Email, row.Operator, row.Operator]); // username is row.Operator

          const opInsert = `
              INSERT INTO operators (op_id, email, name, user_id)
              VALUES ${operators.map(() => "(?, ?, ?, (SELECT id FROM users WHERE username = ?))").join(", ")}
          `;

          const values = operators.flat(); // Flatten the array to match query placeholders

          await connection.query(opInsert, values);


          // Insert new data from the CSV
          for (const row of results) {
            // Get operator_id based on Operator column
            const [operator] = await connection.query(
              "SELECT id FROM operators WHERE name = ?",
              [row.Operator]
            );

            const operatorId = operator.length > 0 ? operator[0].id : null;
            // Insert the data into the toll_stations table
            await connection.query(
              `
              INSERT INTO toll_stations 
              (road, locality, name, lat, lon, price1, price2, price3, price4, toll_id, operator_id, email)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                row.Road,
                row.Locality,
                row.Name,
                parseFloat(row.Lat),
                parseFloat(row.Long),
                parseFloat(row.Price1),
                parseFloat(row.Price2),
                parseFloat(row.Price3),
                parseFloat(row.Price4),
                row.TollID,
                operatorId,
                row.Email,
              ]
            );
          }

          // Commit the transaction
          await connection.commit();
          logToBoth("Toll stations have been reset.");
          res.status(200).json({ status: "OK"});
        } catch (error) {
          // Rollback on error
          await connection.rollback();
          logToBothErr(error);
          res.status(500).json({ "status": "failed", "info": error.message});
        } finally {
          connection.release();
        }
      });
  } catch (error) {
    logToBoth(error);
    res.status(500).send("An error occurred while processing the CSV file.");
  }
};