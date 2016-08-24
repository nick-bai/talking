/// <reference path="../../typings/tsd.d.ts"/>
module RongWebIMWidget {

    export enum EnumConversationListPosition {
        left = 0, right = 1
    }

    export enum EnumConversationType {
        PRIVATE = 1, DISCUSSION = 2, GROUP = 3, CHATROOM = 4, CUSTOMER_SERVICE = 5, SYSTEM = 6, APP_PUBLIC_SERVICE = 7, PUBLIC_SERVICE = 8
    }

    export enum MessageDirection {
        SEND = 1,
        RECEIVE = 2,
    }

    export enum ReceivedStatus {
        READ = 0x1,
        LISTENED = 0x2,
        DOWNLOADED = 0x4
    }

    export enum SentStatus {
        /**
         * 发送中。
         */
        SENDING = 10,
        /**
         * 发送失败。
         */
        FAILED = 20,
        /**
         * 已发送。
         */
        SENT = 30,
        /**
         * 对方已接收。
         */
        RECEIVED = 40,
        /**
         * 对方已读。
         */
        READ = 50,
        /**
         * 对方已销毁。
         */
        DESTROYED = 60,
    }

    enum AnimationType {
        left = 1, right = 2, top = 3, bottom = 4
    }

    export enum EnumInputPanelType {
        person = 0, robot = 1, robotSwitchPerson = 2, notService = 4
    }

    export enum EnumCustomerStatus {
        person = 1, robot = 2,
    }

    export var MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage ",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        ChangeModeResponseMessage: "ChangeModeResponseMessage",
        TerminateMessage: "TerminateMessage",
        CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage",
        ReadReceiptMessage: "ReadReceiptMessage"
    }

    export enum PanelType {
        Message = 1, InformationNotification = 2,
        System = 103, Time = 104, getHistory = 105, getMore = 106,
        Other = 0
    }

    export class ChatPanel {
        panelType: PanelType
        constructor(type: number) {
            this.panelType = type;
        }
    }

    export class TimePanl extends ChatPanel {
        sentTime: Date;
        constructor(date: Date) {
            super(PanelType.Time);
            this.sentTime = date;
        }
    }

    export class GetHistoryPanel extends ChatPanel {
        constructor() {
            super(PanelType.getHistory);
        }
    }

    export class GetMoreMessagePanel extends ChatPanel {
        constructor() {
            super(PanelType.getMore);
        }
    }

    export class TimePanel extends ChatPanel {
        sentTime: Date
        constructor(time: Date) {
            super(PanelType.Time);
            this.sentTime = time;
        }
    }



    export class Message extends ChatPanel {
        content: any;
        conversationType: any;
        extra: string;
        objectName: string;
        messageDirection: MessageDirection;
        messageId: string;
        receivedStatus: ReceivedStatus;
        receivedTime: Date;
        senderUserId: string;
        sentStatus: SentStatus;
        sentTime: Date;
        targetId: string;
        messageType: string;
        constructor(content?: any, conversationType?: string, extra?: string, objectName?: string, messageDirection?: MessageDirection, messageId?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, messageType?: string) {
            super(PanelType.Message);
        }
        static convert(SDKmsg: any) {

            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;

            switch (msg.messageType) {
                case MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    content = RongWebIMWidget.Helper.escapeSymbol.encodeHtmlsymbol(content);
                    content = RongWebIMWidget.Helper.discernUrlEmailInStr(content);
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;
                    texmsg.extra = SDKmsg.content.extra;

                    msg.content = texmsg;
                    break;
                case MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;
                    image.extra = SDKmsg.content.extra;

                    msg.content = image;
                    break;

                case MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;
                    voice.extra = SDKmsg.content.extra;

                    msg.content = voice;
                    break;

                case MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;
                    rich.extra = SDKmsg.content.extra;

                    msg.content = rich;
                    break;
                case MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;
                    location.extra = SDKmsg.content.extra;

                    msg.content = location;
                    break;
                case MessageType.InformationNotificationMessage:
                    var info = new InformationNotificationMessage();
                    msg.panelType = 2;//灰条消息
                    info.content = SDKmsg.content.message;

                    msg.content = info;
                    break;
                case MessageType.DiscussionNotificationMessage:
                    var discussion = new DiscussionNotificationMessage();
                    discussion.extension = SDKmsg.content.extension;
                    discussion.operation = SDKmsg.content.operation;
                    discussion.type = SDKmsg.content.type;
                    discussion.isHasReceived = SDKmsg.content.isHasReceived;

                    msg.content = discussion;
                case MessageType.HandShakeResponseMessage:
                    var handshak = new HandShakeResponseMessage();
                    handshak.status = SDKmsg.content.status;
                    handshak.msg = SDKmsg.content.msg;
                    handshak.data = SDKmsg.content.data;
                    msg.content = handshak;
                    break;
                case MessageType.ChangeModeResponseMessage:
                    var change = new ChangeModeResponseMessage();
                    change.code = SDKmsg.content.code;
                    change.data = SDKmsg.content.data;
                    change.status = SDKmsg.content.status;
                    msg.content = change;
                    break;
                case MessageType.CustomerStatusUpdateMessage:
                    var up = new CustomerStatusUpdateMessage();
                    up.serviceStatus = SDKmsg.content.serviceStatus;
                    msg.content = up;
                    break;
                case MessageType.TerminateMessage:
                    var ter = new TerminateMessage();
                    ter.code = SDKmsg.content.code;
                    msg.content = ter;
                    break;
                default:

                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.user;
            }

            return msg;
        }

        static messageToNotification = function(msg: any) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent: string;
            if (msgtype == MessageType.ImageMessage) {
                msgContent = "[图片]";
            } else if (msgtype == MessageType.LocationMessage) {
                msgContent = "[位置]";
            } else if (msgtype == MessageType.VoiceMessage) {
                msgContent = "[语音]";
            } else if (msgtype == MessageType.ContactNotificationMessage || msgtype == MessageType.CommandNotificationMessage) {
                msgContent = "[通知消息]";
            } else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.message.content.data.data
                switch (msg.content.message.content.operation) {
                    case "Add":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 加入了群组") : "加入群组";
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + " 退出了群组";
                        break;
                    case "Kicked":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 被剔出群组") : "移除群组";
                        break;
                    case "Rename":
                        msgContent = data.operatorNickname + " 修改了群名称";
                        break;
                    case "Create":
                        msgContent = data.operatorNickname + " 创建了群组";
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + " 解散了群组 " + data.targetGroupName;
                        break;
                    default:
                        break;
                }
            }
            else {
                msgContent = msg.content ? msg.content.content : "";
                msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
            }
            return msgContent;
        }
    }

    export class UserInfo {
        userId: string;
        name: string;
        portraitUri: string;
        constructor(userId: string, name: string, portraitUri?: string) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
    }

    export class GroupInfo {
        userId: string;
        name: string;
        portraitUri: string;
        constructor(userId: string, name: string, portraitUri?: string) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
    }

    export class TextMessage {
        userInfo: UserInfo;
        content: string;
        extra: any;
        constructor(msg?: any) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
    }
    export class HandShakeResponseMessage {
        status: string
        msg: string
        data: {
            uid: string,
            pid: string,
            sid: string,
            serviceType: string,
            isblack: string,
            notAutoCha: string,
            roboWelcome: string,
            robotName: string,
            robotIcon: string,
            humanWelcome: string,
            companyName: string,
            noOneOnlineTip: string
        }
    }
    export class ChangeModeResponseMessage {
        code: string
        data: any//1成功，2没有客服在线，3用户被拉黑，4用户已转人工
        status: string
    }
    export class TerminateMessage {
        code: string //0表示会话结束，1转为机器人
    }
    export class CustomerStatusUpdateMessage {
        serviceStatus: string//1机器人，2人工，3无法服务
    }

    export class InformationNotificationMessage {
        userInfo: UserInfo;
        content: string;
        extra: string;
        messageName: string;
    }

    export class ImageMessage {
        userInfo: UserInfo;
        content: string;
        imageUri: string;
        extra: any;
    }

    export class VoiceMessage {
        userInfo: UserInfo;
        content: string;
        duration: string;
        extra: any;
    }

    export class LocationMessage {
        userInfo: UserInfo;
        content: string;
        latiude: number;
        longitude: number;
        poi: string;
        extra: any;
    }

    export class RichContentMessage {
        userInfo: UserInfo;
        content: string;
        title: string;
        imageUri: string;
        extra: any;
    }

    export class DiscussionNotificationMessage {
        userInfo: UserInfo;
        extension: string;
        type: number;
        isHasReceived: boolean;
        operation: string;
        extra: string;
        messageName: string;
    }

    export class Conversation {
        targetType: number;
        targetId: string;
        title: string;
        portraitUri: string;
        unreadMessageCount: number

        onLine: boolean;

        constructor(targetType?: number, targetId?: string, title?: string) {
            this.targetType = targetType;
            this.targetId = targetId;
            this.title = title || "";
        }

        static onvert(item: RongIMLib.Conversation) {
            var conver = new Conversation();

            conver.targetId = item.targetId;
            conver.targetType = item.conversationType;
            conver.title = item.conversationTitle;
            conver.portraitUri = item.senderPortraitUri;

            conver.unreadMessageCount = item.unreadMessageCount;

            return conver;
        }
    }


}
