const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/metadata`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch metadata:', err);
    throw err;
  }
}

export async function fetchModelInfo() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/model-info`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch model info:', err);
    throw err;
  }
}

export async function predictPrice(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Prediction failed with status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Prediction request failed:', err);
    throw err;
  }
}
