const { Log } = require('../models')
const { schemaValidationForLogs } = require('../utils/validators')

module.exports = {

  getBySender: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { senderApplication } } = req
      const logs = await Log.findAll({
        where: { UserId, senderApplication }
      })

      if (logs.length === 0) {
        return res.status(204).json({ message: 'there is no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByEnvironment: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { environment } } = req
      const logs = await Log.findAll({
        where: { UserId, environment }
      })

      if (logs.length === 0) {
        return res.status(204).json({ message: 'there is no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  getByLevel: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { params: { level } } = req
      const logs = await Log.findAll({
        where: { UserId, level }
      })

      if (logs.length === 0) {
        return res.status(204).json({ message: 'there is no logs' })
      }

      return res.status(200).json(logs)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  create: async (req, res) => {
    try {
      const { locals: { UserId } } = req
      const { body } = req
      const isValidSchemaLog = await schemaValidationForLogs(body)

      if (!isValidSchemaLog) {
        return res.status(406).json({ message: 'Log body is not valid' })
      }

      const result = await Log.create({
        ...body,
        UserId
      })

      return res.status(200).json({ result })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteByLogId: async (req, res) => {
    try {
      const UserId = req.locals
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { UserId, id }
      })

      if (!logExist) {
        return res.status(406).json({ message: 'Log not existis.' })
      }

      await Log.destroy({
        where: { id }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteById: async (req, res) => {
    try {
      const { params: { id } } = req

      const logExist = await Log.findOne({
        where: { id }
      })

      if (!logExist) {
        return res.status(406).json({ message: 'Log not existis.' })
      }

      await Log.destroy({
        where: { id },
        force: true
      })

      return res.status(200).json({ message: 'Log deleted forever, this cannot be undone.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  deleteAllLogsByUser: async (req, res) => {
    try {
      const UserId = req.locals
      const logs = await Log.findAll({
        where: { UserId }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId }
      })

      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  hardDeleteAll: async (req, res) => {
    try {
      const UserId = req.locals

      const logs = await Log.findAll({
        where: { UserId }
      })

      if (logs.length === 0) {
        return res.status(406).json({ message: 'There is no logs to delete' })
      }

      await Log.destroy({
        where: { UserId },
        force: true
      })
      return res.status(200).json({ message: 'All logs deleted forever, this cannot be undone.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  restoreLogById: async (req, res) => {
    const { params: { id } } = req
    const logs = await Log.findOne({
      where: {
        id
      },
      paranoid: false
    })

    if (!logs) {
      return res.status(400).json({ message: 'There is no logs to restore' })
    }

    await Log.restore()

    return res.status(200).json({ message: 'All logs restored successfully.' })
  },

  restoreAllLogs: async (req, res) => {
    const UserId = req.locals

    const logs = await Log.findAll({
      where: { UserId },
      paranoid: false
    })

    if (logs.length === 0) {
      return res.status(400).json({ message: 'There is no logs to restore' })
    }

    await Log.restore({
      where: { UserId }
    })

    return res.status(200).json({ message: 'All logs restored successfully.' })
  }
}
