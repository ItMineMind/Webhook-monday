async function insertSession(
    pool,
    { owner, date, type, task , service , startTime, endTime }
  ) {
  
    const query = `
      INSERT INTO public.sessions (owner, date, type, task, start_time, end_time, service)
      SELECT $1, $2, $3, $4, $5, $6, $7
      WHERE NOT EXISTS (
        SELECT 1 FROM public.sessions
        WHERE owner = $1
        AND date = $2
        AND type = $3
        AND task = $4
        AND start_time = $5
        AND end_time = $6
        AND service = $7
      )
    `;

  
    const values = [owner, date, type, task, startTime, endTime, service];
  
    try {
      await pool.query(query, values);
    } catch (error) {
      console.error("Error inserting session:", error.message);
    }
}

module.exports = insertSession;
