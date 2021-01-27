import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ChannelModeratedByAppInstanceUserSummary } from 'aws-sdk/clients/chime';

import { v4 as uuid } from 'uuid';

import { RoomData, UserData, ChatData } from './multi.interface'

const rooms = {};
const users = {};

@Injectable()
export class MultiService {

  constructor() {}

  async create(hostId: string, roomData: RoomData) {
      const { roomCode, maxNum, nickName } = roomData
    
      if (roomCode in rooms) return {error: '방 이름이 중복됩니다.'} //룸코드 중복 검사 

      const roomId = uuid() // 신규 방 id 생성

      const newUser = { //신규 멤버 생성
        nickName: nickName,
        clientId: hostId
      }
      console.log(newUser)
      const newRoom = { // 신규 방 생성 
        maxNum: maxNum, 
        roomId: roomId,
        userList: [newUser],
      }
    
      rooms[roomCode] = newRoom //방 목록에 추가
      console.log(rooms[roomCode])
      return { roomId: roomId }
  }

  async join(hostId: string, userData: UserData) {
    const { roomCode, nickName } = userData
    if (!(roomCode in rooms)) return {error: '찾으시는 방이 없습니다 ㅠㅠ'};

    const { userList, roomId, maxNum } = rooms[roomCode];
    const isRoomFull = list => list.length >= maxNum;

    
    if (isRoomFull(userList)) return {error: '방이 꽉 찼어요!'}

    const newUser = { //신규 멤버 생성
      nickName: nickName,
      clientId: hostId}
    console.log(newUser)
    
    userList.push(newUser); //기존 방에 신규멤버 추가
    console.log('신규멤버',userList)
  
    return { roomId: roomId } 
  }

  async alert(hostId: string, userData) {
    const { roomCode } = userData;
    
    if(!(roomCode in rooms)) return {error: '방이 없군여!'}
    const { roomId, userList } = rooms[roomCode]

    const index = userList.findIndex(user => user.clientId === hostId)
    const user = userList[index]

    return { roomId: roomId, user: user }
  }

  setProfile(hostId: string, userData) {
    const { roomCode } = userData;
    const { userList, roomId } = rooms[roomCode];
  
    const index = userList.findIndex(user => user.clientId === hostId)
    const user = userList[index]

    if(userData.nickName) user.nickName = userData.nickName;
    if(userData.photoUrl) user.photoUrl = userData.photoUrl;
    
    return { roomId: roomId, user: user }
  }

  async leave(hostId: string, userData: UserData) {
    //data로 room code 가 들어온다는 가정 하에 
    const { roomCode, nickName } = userData;
    const { userList, roomId } = rooms[roomCode];
    if(roomCode in rooms) {
      const index = userList.findIndex(user => user.clientId === hostId)

      userList.splice(index, 1); //기존 멤버 목록에서 삭제
      console.log(hostId,'님이 떠나셨습니다.')
      console.log(userList); 

      return { roomId : roomId}
    } else {
      return { error : '룸이 없어요'}
    }
  }

  async chat(chatData: ChatData) {
    const { roomId } = rooms[chatData.roomCode];
    return { roomId : roomId }
  }
}
