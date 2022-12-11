const login = require("./handle/login")
const register = require("./handle/register")

module.exports = function handleWrapper(message, session) {
    (handlers[message.method] || (() => { session.send({ method: "chat", color: "red", text: "Invalid method!", from: "[SYSTEM]" }) }))(message, session)
}

let handlers = ({
    login,
    register,
})