const { Log, User } = require('../models')
const { schemaValidationForLogs } = require('../utils/validators')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const { locals: id } = req
      const { params: { senderApplication } } = req

      const logs = await Log.findAll({
        where: { UserId: id, senderApplication }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      return res.status(200).json({ total: hasLogs, logs })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  getByEnvironment: async (req, res) => {
    try {
      const { locals: id } = req
      const { params: { environment } } = req

      const logs = await Log.findAll({
        where: { UserId: id, environment }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      return res.status(200).json({ total: hasLogs, logs })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  getByLevel: async (req, res) => {
    try {
      const { locals: id } = req
      const { params: { level } } = req

      const logs = await Log.findAll({
        where: { UserId: id, level }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      return res.status(200).json({ total: hasLogs, logs })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  getAllLogs: async (req, res) => {
    try {
      const { locals: id } = req

      const isLogsFound = await User.findOne({
        where: { id },
        include: Log
      })

      if (isLogsFound === null) {
        return res.status(204).json({})
      }
      const { dataValues: { Logs } } = isLogsFound

      const hasLogs = Logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      return res.status(200).json({ total: hasLogs, Logs })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  create: async (req, res) => {
    try {
      const { locals: id } = req
      const { body } = req

      const isValidSchemaLog = await schemaValidationForLogs(body)

      if (!isValidSchemaLog) {
        return res.status(406).json({ message: 'Invalid data' })
      }

      const createdLog = await Log.create({
        ...body,
        UserId: id
      })

      return res.status(201).json({ createdLog })

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  restoreById: async (req, res) => {
    try {
      const { params: { id } } = req
      const UserId = req.locals

      const isLogFound = await Log.findOne({
        where: {
          UserId,
          id
        },
        paranoid: false
      })

      if (!isLogFound) {
        return res.status(204).json({})
      }

      await Log.restore({
        where: { id }
      })

      return res.status(200).json({ message: 'Log restored successfully' })

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  restoreAllByUser: async (req, res) => {
    try {
      const { locals: id } = req

      const logs = await Log.findAll({
        where: { UserId: id },
        paranoid: false
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      await Log.restore({
        where: { UserId: id }
      })

      return res.status(200).json({ message: 'All logs restored successfully' })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  deleteById: async (req, res) => {
    try {
      const { locals: UserId } = req
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { UserId, id }
      })

      if (!logExist) {
        return res.status(204).json({})
      }

      await Log.destroy({
        where: { UserId, id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  deleteAllByUser: async (req, res) => {
    try {
      const { locals: id } = req
      const logs = await Log.findAll({
        where: { UserId: id }
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      await Log.destroy({
        where: { UserId: id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  hardDeleteById: async (req, res) => {
    try {
      const { params: { id } } = req
      const UserId = req.locals

      const logExist = await Log.findOne({
        where: { UserId, id },
        paranoid: false
      })

      if (!logExist) {
        return res.status(204).json({})
      }

      await Log.destroy({
        where: { UserId, id },
        force: true
      })

      return res.status(200).json({ message: 'Deleted successfully, this action cannot be undone' })

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  hardDeleteAllByUser: async (req, res) => {
    try {
      const { locals: id } = req

      const logs = await Log.findAll({
        where: { UserId: id },
        paranoid: false
      })

      const hasLogs = logs.length
      if (!hasLogs) {
        return res.status(204).json({})
      }

      await Log.destroy({
        where: { UserId: id },
        force: true
      })

      return res.status(200).json({ message: 'Deleted successfully, this action cannot be undone' })
      
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
