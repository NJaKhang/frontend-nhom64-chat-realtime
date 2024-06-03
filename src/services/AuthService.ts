import {SocketEvent} from "@constants/SocketEvent.ts";
import LoginRequest from "@models/LoginRequest.ts";
import {SocketResponse} from "@models/SocketResponse.ts";
import User from "@models/User.ts";
import socketService from "@services/SocketService.ts";

class AuthService {
    async login(loginRequest: LoginRequest) {
        return new Promise<User>((resolve, reject) => {
            socketService.send(SocketEvent.Login, loginRequest, {
                onSuccess: (data: SocketResponse<never>) => {
                    const user: User = {name: loginRequest.user, code: data.data["RE_LOGIN_CODE"]} as User
                    resolve(user)
                },
                onError: data => {
                    reject(data)
                }
            })
        })
    }

    async reLogin(user: User) {
        return new Promise<User>((resolve, reject) => {
            console.log(user)
            socketService.send(SocketEvent.ReLogin, {
                user: user.name,
                code: user.code
            }, {
                onSuccess: (data) => {
                    console.log(data)
                    resolve({name: user.name, code: data.data["RE_LOGIN_CODE"]} as User)
                },
                onError: data => reject(data)
            })
        })
    }
}

export default new AuthService();