export const sendToHubspot = async (lead) => {
  try {
    const res = await fetch('http://localhost:4000/api/send-to-hubspot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'API error');
    return { success: true, result };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
};