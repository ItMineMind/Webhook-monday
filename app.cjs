// Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
// Importing separated modules
const fetchDataFromMonday = require("./Monday_API/fetchData.cjs");
const fetchSubItemDataFromMonday = require("./Monday_API/fetchSubItem.cjs");
const insertSession = require("./insertSession.cjs");
const calculateOvertime = require("./OT.cjs");
const sendOT = require("./Monday_API/sendOT.cjs");
const getInsertData = require("./getInsertData.cjs");


const pool = require("./connection.cjs");

var isDbConnected = false;
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

// Change column id to your column id
const time_tracking_id = "time_tracking1";
const ot_id = "ot";   // This is for OT column
const person_id = "person";   // This is for User column
const service_noid = "text9";

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  console.log("Has received a request");
  // console.log(req.body);
  
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
    const owner = data.data.items[0].column_values.find((cv) => cv.id == person_id).text;
    const column_values = item.column_values;
    const id = item.id;
    const timeTracking = column_values.find((cv) => cv.id == time_tracking_id);
    const time = timeTracking.history;
    const column_id = column_values.find((cv) => cv.id == ot_id).id;
    const task = item.name;
    const service_no = column_values.find((cv) => cv.id == service_noid).text;

    var OT = 0;
    time.forEach(t => {
      const startDate = new Date(t.started_at);
      const endDate = new Date(t.ended_at);
      const OTresult = calculateOvertime(startDate,endDate);
      const insertTimeData = getInsertData(owner, task, service_no, startDate, endDate);
      console.log("Insert Data:", insertTimeData);
      for (let i = 0; i < insertTimeData.length; i++) {
        insertSession(pool,insertTimeData[i]);
      }
      OT += OTresult;

    });

    sendOT(board_id, id, column_id, OT).then((response) => {
      if(response.errors){
        console.error("Send OT Error:", response.errors);
      }
    });
   
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
