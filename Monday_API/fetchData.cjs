const axios = require("axios");

async function fetchDataFromMonday(pulseId) {
 
  const query = `
    {
        items(ids: ${pulseId}) {
            board {
              id
            }
            id
            name
            column_values(ids: "status") {
                text
            }
            subitems {
                id
                name
                board {
                  id
                }
                column_values {
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



module.exports = fetchDataFromMonday;


