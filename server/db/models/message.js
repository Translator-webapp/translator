const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')
const Conversation = require('./conversation')

const Message = db.define('message', {
  text: Sequelize.STRING,
  userId: Sequelize.INTEGER,
  recerverId: Sequelize.INTEGER
  // _id: {
  //   type: Sequelize.UUID,
  //   defaultValue: Sequelize.UUIDV4,
  //   primaryKey: true
  // }
})

Message.createMessage = async (text, sender, receiver) => {
  const message = await Message.create({
    text,
    userId: sender.id,
    recerverId: receiver.id
    // user: {
    //   _id: sender.id,
    //   email: sender.email
    // }
  })
  const conversation1 = await Conversation.findOrCreateConversation(
    sender.id,
    receiver.id
  )
  // const conversation = await Conversation.findOrCreate({
  //   where: {
  //     user1Id: sender.id,
  //     user2Id: receiver.id
  //   }
  // })
  // console.log('convo proto', Object.keys(conversation.__proto__), 'message proto', Object.keys(message.__proto__))
  // conversation.dataValue.id
  console.log(conversation1[0].dataValues.id)
  await message.setConversation(conversation1[0].dataValues.id)
  // console.log('conversation ', conversation1)
}
module.exports = Message
