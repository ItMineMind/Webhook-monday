// Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const pool = require("./connection.cjs");
// Importing separated modules
const fetchDataFromMonday = require("./Monday_API/fetchData.cjs");
const insertItem = require("./insertItem.cjs");
const insertSession = require("./insertSession.cjs");
const calculateOvertime = require("./OT.cjs");
const sendOT = require("./Monday_API/sendOT.cjs");

// Load environment variables


// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());

// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
  }
}
testDatabaseConnection();



app.post("/", async (req, res) => {
  // console.log("Request body:", req.body);

  const challenge = req.body.challenge;
  if (challenge) {
    return res.status(200).send({ challenge });
  }

  const { pulseId } = req.body.event;
  if (!pulseId) {
    return res.status(400).send({ error: "pulseId is missing" });
  }

  try {
    const data = await fetchDataFromMonday(pulseId);
    const subItem = data.data.items[0].subitems;
    
    subItem.forEach(sub => {
      const column_values = sub.column_values;
      const subItem_id = sub.id;
      const timeTracking = column_values.find((cv) => cv.id === 'time_tracking');
      const time = timeTracking.history;

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
        insertSession(pool, {
          subItemId: subItem_id,
          endUserId: t.ended_user_id,
          startDateTime: t.started_at,
          endDateTime: t.ended_at,
          subStatus: column_values.find((cv) => cv.id === 'status').text
        });
      });
      const column_id = column_values.find((cv) => cv.id === 'text' && cv.column.title === 'OT').id;
      const board_id = sub.board.id;
      sendOT(board_id, subItem_id, column_id , OT);
      const status = column_values.find((cv) => cv.id === 'status').text;

      insertItem(pool, { 
        itemId: data.data.items[0].id, 
        itemName: data.data.items[0].name, 
        subItemId: subItem_id, 
        subItemName: sub.name, 
        duration: timeTracking.duration, 
        status: status
      });


      // { subItemId, endUserId, startDateTime, endDateTime, subStatus }
    });


    return res.status(200).send({ data });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({ error: "Failed to fetch and save data" });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
