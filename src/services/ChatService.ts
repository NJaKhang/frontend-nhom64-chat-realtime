import {SocketEvent} from "@constants/SocketEvent.ts";
import Message from "@models/Message.ts";
import {SocketResponse} from "@models/SocketResponse.ts";
import socketService from "@services/SocketService.ts";

class ChatService {
    async findPeopleChats(name: string, page: number = 1) {
        return new Promise<Message[]>((resolve, reject) => {
            socketService.send(SocketEvent.GetPeopleMessage,
                {
                    page,
                    name
                },
                {
                    onSuccess: (data: SocketResponse<never>) => {
                        const messages = data.data as Message[]
                        resolve(messages)
                    },
                    onError: data => {
                        reject(data.data)
                    }
                })
        })
    }

    sendMessage(message: string, target: string) {
        socketService.send(SocketEvent.SendChat, {
            type: "people",
            mes: message,
            to:  target

        })
    }
}

export default new ChatService();