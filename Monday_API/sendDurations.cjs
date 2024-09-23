const axios = require("axios");
async function sendDuration(board_id,subitem_id,column_id,duration_input) {
    var day,hour, minute, second;
    var duration = "";
    if(duration_input > 86400){
        day = Math.floor(duration_input/86400);
    } else if(duration_input > 3600){
        hour = Math.floor(duration_input/3600);
        minute = Math.floor((duration_input%3600)/60);
        second = (duration_input%3600)%60;
    } else if(duration_input > 60){
        minute = Math.floor(duration_input/60);
        second = duration_input%60;
    } else{
        second = duration_input;
    }
    if (day){
        duration = `${day} Day`;
    } else{
        if(hour){
            duration += `${hour} Hour ${minute} Minute`;
        }
        else if(minute){
            duration += `${minute} Minute ${second} Second`;
        }
        else{
            duration += `${second} Second`;
        }
    }
    const query = `
        mutation {
            change_simple_column_value(
                board_id: ${board_id},  
                item_id: ${subitem_id},
                column_id: "${column_id}",
                value: "${duration}"
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
  

module.exports = sendDuration;
