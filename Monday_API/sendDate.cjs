const axios = require("axios");
async function sendDate(board_id,subitem_id,column_id) {
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const query = `
        mutation {
            change_column_value(
                board_id: ${board_id},  
                item_id: ${subitem_id},
                column_id: "${column_id}",
                value: "{\\"date\\":\\"${today}\\"}"
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
        console.error("Error fetching data from Monday.com:", error.message);
        throw error;
    }
  }
  

module.exports = sendDate;
