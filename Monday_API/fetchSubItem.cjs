const axios = require("axios");

async function fetchSubItemDataFromMonday(pulseId) {
    const query = `
    {
        items(ids: ${pulseId}) {
            id
            name
            column_values {
                ... on PeopleValue{
                    id
                    text
                }
                ... on TimeTrackingValue {
                    id
                    running
                    duration
                    history {
                        ended_user_id 
                        started_at
                        ended_at
                    }
                }
                ... on NumbersValue{
                    id
										value
      
                    }
                ... on TextValue{
                    id
                    text
                    column {
                    title
                    id
            
                    }
                }

                ... on StatusValue {
                    text
                    id
                }
            }
            
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


module.exports = fetchSubItemDataFromMonday;