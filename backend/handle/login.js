module.exports = async (message, session) => {
    let account;
    try {
        account = await db.get(message.username)

    } catch (e) {
        account = null
    }
    console.log(account)
    if (!account) {
        session.send({ method: "chat", color: "red", text: "No account found!", from: "[SYSTEM]" })
    }
}