import Message from "@models/Message.ts";

export interface RoomMessageInfo {
    id: number
    name: string
    own: string
    userList: []
    chatData: Message[]
}