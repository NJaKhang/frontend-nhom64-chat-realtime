import {SocketAction} from "@constants/SocketAction.ts";
import {SocketEvent} from "@constants/SocketEvent.ts";
import SocketError from "@models/SocketError.ts";
import {SocketResponse} from "@models/SocketResponse.ts";

const SOCKET_URL = "ws://140.238.54.136:8080/chat/chat"
type SuccessHandler<T> = (data: SocketResponse<T>) => void
type ErrorHandler =(error : SocketError) => void
type SocketSendingOption = {
    onSuccess?: SuccessHandler<never>
    onError?: ErrorHandler
}

class SocketService {
    socket: WebSocket
    successHandlers: Map<SocketEvent, SuccessHandler<never>>
    errorHandlers: Map<SocketEvent, ErrorHandler>
    onOpen: () => void;

    constructor() {
        this.socket = new WebSocket(SOCKET_URL);
        this.socket.onmessage = (ev) => {
            this.handleReceive(ev);
        }
        this.socket.onopen = () => {
            this.onOpen && this.onOpen()
        }

        this.successHandlers = new Map<SocketEvent, SuccessHandler<never>>()
        this.errorHandlers = new Map<SocketEvent, ErrorHandler>()
    }

    handleError(error: SocketError) {
        const handler = this.errorHandlers.get(error.event)
        handler && handler(error);
    }

    handleSuccess(data: SocketResponse<never>) {

        const handler = this.successHandlers.get(data.event)
        handler && handler(data);
    }

    handleReceive(ev: MessageEvent) {
        const data = JSON.parse(ev.data)
        if (data.status == "error") {
            this.handleError(data as SocketError)
        } else {
            this.handleSuccess(data as SocketResponse<never>);
        }

    }

    send<D>(event: SocketEvent, data?: D, option: SocketSendingOption = {}, action = SocketAction.OnChat) {
        if (this.socket.readyState != this.socket.OPEN)
            throw new Error("Socket is not contented");
        const {onError, onSuccess} = option
        onSuccess && this.successHandlers.set(event, onSuccess)
        onError && this.errorHandlers.set(event, onError)
        this.socket.send(JSON.stringify({
            action,
            data: {
                event,
                data
            }
        }))

    }

    close() {
        this.socket.close()
    }


    isOpen() {
        return this.socket.readyState === this.socket.OPEN;
    }
}

export default new SocketService();