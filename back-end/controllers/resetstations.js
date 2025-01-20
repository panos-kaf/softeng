const db = require("../utils/db");
const fs = require("fs");
const csv = require("csv-parser");

exports.resetStations = async (req, res, next) => {
  const filePath = "data/stations.csv"; // Path to your predefined CSV file

  try {
    const results = [];

    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const connection = await db.getConnection(); // Use db utility to get the connection

        try {
          // Start a transaction
          await connection.beginTransaction();

          // Clear existing toll stations
          await connection.query("DELETE FROM toll_stations");

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
              (road, locality, lat, lon, price1, price2, price3, price4, toll_id, operator_id, email)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                row.Road,
                row.Locality,
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
          res.status(200).send("Toll stations reset successfully!");
        } catch (error) {
          // Rollback on error
          await connection.rollback();
          console.error(error);
          res.status(500).send("An error occurred while resetting toll stations.");
        } finally {
          connection.release(); // Release the connection
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the CSV file.");
  }
};