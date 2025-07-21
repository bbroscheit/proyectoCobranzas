const { Client, Note } = require('../../bd');

const getAllNotes = async () => {
    try {
      const notes = await Note.findAll();
        if (notes.length > 0) {
            return notes;
        } else {
            return null;
        }

    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  };

module.exports = getAllNotes;