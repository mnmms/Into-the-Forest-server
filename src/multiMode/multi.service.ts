import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ChannelModeratedByAppInstanceUserSummary } from 'aws-sdk/clients/chime';

import { v4 as uuid } from 'uuid';

import { RoomData, UserData, ChatData } from './multi.interface'

const rooms = {};

@Injectable()
export class MultiService {

  constructor() {}

  async create(hostId: string, roomData: RoomData) {
      const { roomCode, maxNum, nickName } = roomData

      if (roomCode in rooms) return {error: '방 이름이 중복됩니다.'} //룸코드 중복 검사 

      const roomId = uuid() // 신규 방 id 생성

      const newMember = { //신규 멤버 생성
        nickName: nickName,
        clientId: hostId
      }
  
      const newRoom = { // 신규 방 생성 
        maxNum: maxNum, 
        roomId: roomId,
        memberList: [newMember],
      }
    
      rooms[roomCode] = newRoom //방 목록에 추가
      console.log(rooms)
      return { roomId: roomId }
  }

  async join(hostId: string, userData: UserData) {
    const { roomCode, nickName } = userData
    if (!(roomCode in rooms)) return {error: '찾으시는 방이 없습니다 ㅠㅠ'};

    const { memberList, roomId, maxNum } = rooms[roomCode];
    const isRoomFull = list => list.length >= maxNum;

    
    if (isRoomFull(memberList)) return {error: '방이 꽉 찼어요!'}

    const newMember = { //신규 멤버 생성
      nickName: nickName,
      clientId: hostId}
    console.log(newMember)
    
    memberList.push(newMember); //기존 방에 신규멤버 추가
    console.log('신규멤버',memberList)
  
    return { roomId: roomId, newMember: newMember } 
  }

  async alert(hostId: string, userData) {
    const { roomCode } = userData;
    const { roomId, memberList } = rooms[roomCode]

    if(!(roomCode in rooms)) return {error: '방이 없군여!'}
    
    let index = memberList.forEach((ele, idx) => {
      if(ele.clientId === hostId) return idx
    })
    let member = memberList[index]

    return { roomId: roomId, newMember: member }
  }

  async leave(hostId: string, userData: UserData) {
    //data로 room code 가 들어온다는 가정 하에 
    const { roomCode, nickName } = userData;
    const { memberList, roomId } = rooms[roomCode];
    if(roomCode in rooms) {
      const index = memberList.forEach((ele, idx) => {
        if(ele.clientId === hostId) return idx
      });
      memberList.splice(index, 1); //기존 멤버 목록에서 삭제
      console.log(hostId,'님이 떠나셨습니다.')
      console.log(memberList); 

      return { roomId : roomId}
    } else {
      return { error : '룸이 없어요'}
    }
  }

  async chat(hostId: string, chatData: ChatData) {
    const { roomCode, chat } = chatData;
    const { memberList, roomId } = rooms[roomCode]
    
    const index = memberList.forEach((ele, idx) => { //멤버 목록에 현재 hostid 있는지 확인
      if(ele.clientId !== hostId) return idx
    }) //chat 에서는 어떤 에러가 나는가? 

    if(index) return { error: '방 회원이 아닙니다?!'} 
    
    return { roomId: roomId, chat: chat }
  }
}
