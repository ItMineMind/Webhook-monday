async function insertSession(
    pool,
    { subItemId, endUserId, startDateTime, endDateTime, subStatus }
  ) {
    console.log("Data being inserted/updated:", {
        subItemId,
        endUserId,
        startDateTime,
        endDateTime,
        subStatus
      });
      
    if (!subItemId || !endUserId || !startDateTime) {
      console.error("subItemId, endUserId, or startDateTime are missing");
      return;
    }
  
    const query = `
      INSERT INTO public.sessions (subItemId, endUserId, startDateTime, endDateTime, subStatus)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (subItemId, endUserId, startDateTime)
      DO UPDATE SET
        endDateTime = EXCLUDED.endDateTime,
        subStatus = EXCLUDED.subStatus;
    `;
  
    const values = [subItemId, endUserId, startDateTime, endDateTime, subStatus];
  
    try {
      await pool.query(query, values);
      console.log(`Session for subitem ${subItemId} added/updated successfully.`);
    } catch (error) {
      console.error("Error inserting session:", error.message);
    }
  }
  
  module.exports = insertSession;
  