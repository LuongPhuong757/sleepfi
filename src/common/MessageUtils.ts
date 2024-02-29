import { MessagesCode } from '../shared/constants/index'
class MessageHelper {
  public MsgList = MessagesCode

  public gMessageInfo(msgCode: string) {
    return {
      msg_code: msgCode,
      message: MessagesCode[msgCode]
    }
  }

  public getKey(msgCode: string) {
    return MessagesCode[msgCode]
  }
}

const MsgHelper = new MessageHelper()
export default MsgHelper
