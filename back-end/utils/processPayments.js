const db = require("../utils/db");
const axios = require('axios');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;
const URL = `https://${HOST}:${PORT}/api`;

const processPayments = async (req, res) => {

    try{        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const opQuery = `SELECT operator FROM operators`;
            const [operators] = await db.execute(opQuery);

            for (operator of operators){
                const response = await axios.get(`${URL}/passesCost/${toll_op}/${tag_op}/${date_from}/${date_to}`);
                response.data.forEach(debt => {
                    totalDebts.push({
                        debtor_op: debt.tagOpID,
                        creditor_op: opID,
                        cost: debt.passesCost
                    })
                })
            }

            console.log(operators);
        }catch(error){
            console.log();
            res.status(500).json({message: error})
        }
    }catch(error){

    };

    console.log(`#${i}calculating payments...`);
};

module.exports = { processPayments };