type CallbackAction = () => void

export default function () {
    let callbacks: CallbackAction[] = []
    if (!(window as any).x_callbacks) {
        (window as any).x_callbacks = callbacks
        window.setInterval(() => {
            for (let cb of  (window as any).x_callbacks) {
                cb()
            }
        }, 500)
    }
    else {
        callbacks = (window as any).x_callbacks
    }

    const register = (cb: CallbackAction) => {
        callbacks.push(cb)
        return cb
    }

    const unregister = (cb: CallbackAction) => {
        callbacks = callbacks.filter(x => x === cb)
    }

    return {
        register,
        unregister
    }
}