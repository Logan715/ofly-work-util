import { EventEmitter } from "events"

const emitter = new EventEmitter()

export const setSessionUser = user => {
    if (user) {
        sessionStorage.setItem("session-user", JSON.stringify(user))
        sessionChangeEmitter(user)
    }
}

export const getSessionUser = () => {
    return JSON.parse(sessionStorage.getItem("session-user"))
}

const getLoginId = () => {
    const { loginId } = getSessionUser() || {}
    return loginId
}

export const removeUserSession = () => {
    sessionChangeEmitter(null)
    sessionStorage.removeItem("session-user")
}

export const sessionChangeListener = func => {
    emitter.addListener("sessionUserChange", func)
}

const sessionChangeEmitter = user => {
    emitter.emit("sessionUserChange", user)
}

export default {
    getLoginId,
    setSessionUser,
    getSessionUser,
    removeUserSession,
    sessionChangeListener
}
