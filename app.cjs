// Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const pool = require("./connection.cjs");
// Importing separated modules
const fetchDataFromMonday = require("./Monday_API/fetchData.cjs");
const fetchSubItemDataFromMonday = require("./Monday_API/fetchSubItem.cjs");
const insertItem = require("./insertItem.cjs");
const insertSession = require("./insertSession.cjs");
const calculateOvertime = require("./OT.cjs");
const sendOT = require("./Monday_API/sendOT.cjs");
const sendDate = require("./Monday_API/sendDate.cjs");
// const sendDuration = require("./Monday_API/sendDurations.cjs");

// Change column id to your column id
const time_tracking_id = "time_tracking";
const status_id = "status";
const text_id = "text";   // This is for OT column
const text_name = "OT";   // This is for OT column
const date_id = "date0";   // This is for Date column
const person_id = "person";   // This is for User column
// const duration_id = "text6";   // This is for Duration column


// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
var isDbConnected = false;
// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
    isDbConnected = true;
  } catch (err) {
    console.error("Failed to connect to the database", err.message);
    isDbConnected = false;
  }
}
testDatabaseConnection();

app.post("/", async (req, res) => {
  console.log("Has received a request");

  const challenge = req.body.challenge;
  if (challenge) {
    console.log("Confirming challenge");
    return res.status(200).send({ challenge });
  }

  const { pulseId } = req.body.event;
  if (!pulseId) {
    return res.status(400).send({ error: "pulseId is missing" });
  }
  const board_id = req.body.event.boardId;
  try {
    const data = await fetchSubItemDataFromMonday(pulseId);
    const item = data.data.items[0];
    // const user = data.data.items[0].column_values.find((cv) => cv.id == person_id).text;
    const column_values = item.column_values;
    const id = item.id;
    const timeTracking = column_values.find((cv) => cv.id == time_tracking_id);
    const time = timeTracking.history;
    const column_id = column_values.find((cv) => cv.id == text_id && cv.column.title == text_name).id;
    const status = column_values.find((cv) => cv.id == status_id).text;

    var OT = 0;
    time.forEach(t => {
      const startDate = new Date(t.started_at);
      const endDate = new Date(t.ended_at);

      startDate.setHours(startDate.getHours() + 7);
      endDate.setHours(endDate.getHours() + 7);

      const strStartDate = startDate.toISOString().slice(0, 19).split("T")[0];
      const strStartTime = startDate.toISOString().slice(0, 19).split("T")[1];
      const strEndDate = endDate.toISOString().slice(0, 19).split("T")[0];
      const strEndTime = endDate.toISOString().slice(0, 19).split("T")[1];

      const OTresult = calculateOvertime(strStartDate, strStartTime, strEndDate, strEndTime);
      OT += OTresult;
      if(isDbConnected){
        insertSession(pool, {
          subItemId: id,
          endUserId: t.ended_user_id,
          startDateTime: t.started_at,
          endDateTime: t.ended_at,
          subStatus: status
        });
      }
    });
    
    if(isDbConnected){
      insertItem(pool, {
        itemId: id,
        itemName: item.name,
        subItemId: id,
        subItemName: item.name,
        duration: timeTracking.duration,
        status: status
      });
    }

    sendOT(board_id, id, column_id, OT).then((response) => {
      if(response.errors){
        console.error("Send OT Error:", response.errors);
      }
    });
    sendDate(board_id, id, date_id).then((response) => {
      if(response.errors){
        console.error("Send Date Error:", response.errors);
      }
    });
    // sendDuration(board_id, id, duration_id, timeTracking.duration).then((response) => {
    //   if(response.errors){
    //     console.error("Send Duration Error:", response.errors);
    //   }
    // });
   
    console.log("End of trigger");
    return res.status(200).send({ data });
  } 
  catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({ error: "Failed to fetch and save data" });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
