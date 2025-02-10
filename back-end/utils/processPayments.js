const db = require("../utils/db");
const axios = require('axios');

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;
const URL = `https://${HOST}:${PORT}/api`;

/*
/dailyCalculateSettlements: 
getDay()
for operator in operators:
{
    operator.debt = /api/chargesBy/operator/today/tomorrow
}
for operator1 in operators:
    for operator2 in operators:
    {
        settlement[operator][operator] = operator1.debt - operator2.debt;
    }
}
console.log(settlement);
*/

const processPayments = async (req, res) => {
    try{        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const opQuery = `SELECT operator FROM operators`;
            const [operators] = await db.execute(opQuery);
            console.log(operators);

            for (operator of operators){
                const response = await axios.get(`${URL}/passesCost/${toll_op}/${tag_op}/${date_from}/${date_to}`);
                response.data.forEach(debt => {
                    totalDebts.push({
                        debtor_op: debt.tagOpID,
                        creditor_op: opID,
                        cost: debt.passesCost
                    })    
                })
                console.log(totalDebts);
            }

            res.status(200).json({message:"OK"});

        }catch(error){
            console.log();
            res.status(500).json({message: error})
        }
    }catch(error){
    };
};

module.exports = { processPayments };


processPayments();