import supabase from '../config/supabase.js';

// Create a new session
export const createSession = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Extracting user ID from the authenticated user

  // Check if session name is provided
  if (!name) {
    return res.status(400).json({ error: 'Session name is required.' });
  }

  // Insert a new session
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ name, user_id: userId }])
    .select('*');

  // Log the response for debugging
  console.log('Insert Response:', { data, error });

  // Check for errors during insertion
  if (error) {
    console.error('Error creating session:', error);
    return res.status(400).json({ error: error.message });
  }

  // Check if data was returned
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(500).json({ error: 'Session could not be created.' });
  }

  // Return the created session
  res.status(201).json({ message: 'Session created successfully', session: data[0] });
};




// Delete a session
export const deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  const { data, error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Session deleted successfully' });
};

// Update a session (e.g., rename or modify details)
export const updateSession = async (req, res) => {
  const { sessionId } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from('sessions')
    .update({ name })
    .eq('id', sessionId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Session updated successfully', session: data[0] });
};

export const getUserSessions = async (req, res) => {
  try {
    // Retrieve the logged-in user's ID from the request (assuming authentication middleware)
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Please log in or sign up first.' });
    }

    // Query to get all sessions created by the logged-in user
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return res.status(500).json({ message: 'Error fetching sessions', error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No sessions found for this user.' });
    }

    // Return the sessions data
    res.status(200).json({ sessions: data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const saveSessionNotes = async (req, res) => {
  const { sessionId } = req.params;
  const { notes } = req.body;



  // Check if notes data is provided
  if (!notes) {
    return res.status(400).json({ error: 'Notes content is required.' });
  }

  // Verify the session exists
  const { data: existingSession, error: fetchError } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .single();

  if (fetchError || !existingSession) {
    console.error('Error fetching session:', fetchError);
    return res.status(404).json({ error: 'Session not found.' });
  }

  // Update the session notes in the database
  const { data, error } = await supabase
    .from('sessions')
    .update({ notes })
    .eq('id', sessionId)
    .select('notes');

  // Check for errors in the update process
  if (error) {
    console.error('Error saving notes:', error);
    return res.status(400).json({ error: error.message });
  }

  // Return the updated notes
  res.status(200).json({ message: 'Notes saved successfully', notes: data[0].notes });
};

// Get notes for a session
export const getSessionNotes = async (req, res) => {
  const { sessionId } = req.params;

  // Fetch the session notes from the database
  const { data, error } = await supabase
    .from('sessions')
    .select('notes')
    .eq('id', sessionId)
    .single();

  // Check for errors
  if (error) {
    console.error('Error retrieving notes:', error);
    return res.status(400).json({ error: error.message });
  }

  // Check if notes exist
  if (!data || !data.notes) {
    return res.status(404).json({ error: 'Session notes not found.' });
  }

  // Return the notes
  res.status(200).json({ notes: data.notes });
};
