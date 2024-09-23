async function insertSession2(
    pool,
    { ItemId, endUserId, user, startDateTime, endDateTime, subStatus }
  ) {
      
    if (!endUserId || !startDateTime) {
      console.error("subItemId, endUserId, or startDateTime are missing");
      return;
    }
  
    const query = `
    
    `;
  
    const values = [ItemId, endUserId, user, startDateTime, endDateTime, subStatus];
  
    try {
      await pool.query(query, values);
      console.log(`Session for subitem ${subItemId} added/updated successfully.`);
    } catch (error) {
      console.error("Error inserting session:", error.message);
    }
}

async function insertItem2(
    pool,
    { itemId, itemName, duration, status , user}
    ) {
    if (!subItemId) {
        console.error("subItemId is missing");
        return;
    }

    const query = `
        
    `;

    const values = [itemId, itemName,user , duration, status];

    try {
        await pool.query(query, values);
        console.log(`Item ${itemId} inserted/updated successfully.`);
    } catch (error) {
        console.error("Error inserting item:", error.message);
    }
}