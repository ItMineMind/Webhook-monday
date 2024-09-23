const axios = require("axios");
async function sendOT(board_id,subitem_id,column_id,OT) {
    const ot_3 = OT.toFixed(3);
    const query = `
        mutation {
            change_simple_column_value(
                board_id: ${board_id},  
                item_id: ${subitem_id},
                column_id: "${column_id}",
                value: "${ot_3}"
            ) {
                id
                name
            }
        }
    `;
    try {
        const response = await axios.post(
          "https://api.monday.com/v2",
          { query },
          {
            headers: {
              Authorization: process.env.MONDAY_API_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending data to Monday.com:", error.message);
        throw error;
    }
  }
  

module.exports = sendOT;
