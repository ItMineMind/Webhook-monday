async function insertItem(
  pool,
  { itemId, itemName, subItemId, subItemName, duration, status }
) {
  if (!subItemId) {
    console.error("subItemId is missing");
    return;
  }

  const query = `
      INSERT INTO public.items (itemId, itemName, subItemId, subItemName, duration, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (subItemId)
      DO UPDATE SET
        itemId = EXCLUDED.itemId,
        itemName = EXCLUDED.itemName,
        subItemName = EXCLUDED.subItemName,
        duration = EXCLUDED.duration,
        status = EXCLUDED.status;
    `;

  const values = [itemId, itemName, subItemId, subItemName, duration, status];

  try {
    await pool.query(query, values);
    console.log(`Item ${itemId} inserted/updated successfully.`);
  } catch (error) {
    console.error("Error inserting item:", error.message);
  }
}

module.exports = insertItem;
