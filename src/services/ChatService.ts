import {SocketEvent} from "@constants/SocketEvent.ts";
import Message from "@models/Message.ts";
import RoomChat from "@models/RoomChat.ts";
import {SocketResponse} from "@models/SocketResponse.ts";
import socketService from "@services/SocketService.ts";
import {RoomMessageInfo} from "@models/RoomMessage.ts";

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
                        reject(data)
                    }
                })
        })
    }

    async findRoomChats(name: string, page: number = 1) {
        return new Promise<RoomMessageInfo>((resolve, reject) => {
            socketService.send(SocketEvent.GetRoomMessage,
                {
                    page,
                    name
                },
                {
                    onSuccess: (data: SocketResponse<never>) => {
                        const roomMessageInfo = data.data as RoomMessageInfo
                        resolve(roomMessageInfo)
                    },
                    onError: data => {
                        reject(data)
                    }
                }
            )
        })
    }

    sendMessage(message: string, target: string) {
        socketService.send(SocketEvent.SendChat, {
            type: "people",
            mes: message,
            to: target

        })
    }

    sendRoomMessage(message: string, room: string) {
        socketService.send(SocketEvent.SendChat, {
            type: "room",
            mes: message,
            to: room
        })
    }

    async createGroup(name: string): Promise<RoomChat> {
        const data = {name: name}
        return new Promise<RoomChat>((resolve, reject) => {
            socketService.send(SocketEvent.CreateRoom, data, {
                onError: error => {
                    reject(error)
                },
                onSuccess: (response: SocketResponse<RoomChat>) => {
                    resolve(response.data);
                }
            })
        })
    }

    async joinGroup(name: string): Promise<RoomChat> {
        const data = {name: name}
        return new Promise<RoomChat>((resolve, reject) => {
            socketService.send(SocketEvent.JoinRoom, data, {
                onError: error => {
                    reject(error)
                },
                onSuccess: (response: SocketResponse<RoomChat>) => {
                    resolve(response.data);
                }
            })
        })
    }

    async findRoomChat() {
        return new Promise<RoomChat[]>((resolve, reject) =>
            socketService.send(SocketEvent.GetUserList, undefined, {
                onError: error => {
                    reject(error)
                },
                onSuccess: ({data}: SocketResponse<any[]>) => {
                    resolve(data.map((d) => {
                        return {name: d.name, type: d.type, actionTime: new Date(d.actionTime)} as RoomChat
                    }))
                }
            })
        )
    }
}

export default new ChatService();