const { Op } = require('sequelize');
const { Client, Note } = require('../../bd');

const getAllNotesInMonth = async (gestor) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    
        const notes = await Note.findAll({
          where: {
            user: gestor,
            createdAt: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        });

        console.log("notes : ", notes);
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

module.exports = getAllNotesInMonth;