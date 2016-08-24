declare module RongIMLib {
    interface OperationCallback {
        onError(error: ErrorCode): void;
        onSuccess(info?: any): void;
    }
    interface ResultCallback<T> {
        onError(error: ErrorCode): void;
        onSuccess(result: T): void;
    }
    interface ConnectCallback extends ResultCallback<string> {
        onSuccess(userId: string): void;
        onTokenIncorrect(): void;
        onError(error: any): void;
    }
    interface CreateDiscussionCallback extends ResultCallback<string> {
        onSuccess(discussionId: string): void;
    }
    interface GetBlacklistCallback extends ResultCallback<string[]> {
        onSuccess(userIds: string[]): void;
    }
    interface GetNotificationQuietHoursCallback {
        onError(error: ErrorCode): void;
        /**
         * 获取消息通知免打扰时间成功。
         *
         * @param startTime   起始时间 格式 HH:MM:SS。
         * @param spanMinutes 间隔分钟数 0 &lt; spanMins &lt; 1440。
         */
        onSuccess(startTime: string, spanMinutes: number): void;
    }
    interface SendImageMessageCallback {
    }
    interface SendMessageCallback {
        onError(error: ErrorCode, result: Message): void;
        onSuccess(result?: Message): void;
    }
    interface GetHistoryMessagesCallback {
        onError(error: ErrorCode): void;
        onSuccess(result: Message[], hasMoreMessages?: boolean): void;
    }
}
declare function md5(str: string): any;
declare var Modules: any;
declare var require: any;
declare var module: any;
declare var define: any;
declare var exports: any;
declare var dcodeIO: any;
declare var Polling: any;
declare var escape: any;
declare var AMR: any;
declare var swfobject: any;
declare var openDatabase: any;
declare class XDomainRequest {
}
interface Window {
    WebSocket: WebSocket;
    Notifications: any;
    RCCallback: any;
    RongIMClient: any;
    getServerEndpoint: any;
    WEB_XHR_POLLING: any;
    SCHEMETYPE: any;
    XDomainRequest: any;
    JSON: any;
    Modules: any;
    handleFileSelect: any;
}
interface Document {
    createStyleSheet: any;
}
interface HTMLScriptElement {
    onreadystatechange: any;
    readyState: any;
}
interface Date {
    toGMTString: any;
}
interface ArrayConstructor {
    forEach: any;
}
interface Document {
    attachEvent: any;
    detachEvent: any;
}
declare module RongIMLib {
    enum BlacklistStatus {
        /**
         * 在黑名单中。
         */
        IN_BLACK_LIST = 0,
        /**
         * 不在黑名单中。
         */
        NOT_IN_BLACK_LIST = 1,
    }
    enum ConnectionChannel {
        XHR_POLLING = 0,
        WEBSOCKET = 1,
        HTTP = 0,
        HTTPS = 1,
    }
    enum CustomerType {
        ONLY_ROBOT = 1,
        ONLY_HUMAN = 2,
        ROBOT_FIRST = 3,
        HUMAN_FIRST = 4,
    }
    enum ConnectionStatus {
        /**
         * 连接成功。
         */
        CONNECTED = 0,
        /**
         * 连接中。
         */
        CONNECTING = 1,
        /**
         * 断开连接。
         */
        DISCONNECTED = 2,
        /**
         * 用户账户在其他设备登录，本机会被踢掉线。
         */
        KICKED_OFFLINE_BY_OTHER_CLIENT = 6,
        /**
         * 网络不可用。
         */
        NETWORK_UNAVAILABLE = 3,
    }
    enum ConversationNotificationStatus {
        /**
         * 免打扰状态，关闭对应会话的通知提醒。
         */
        DO_NOT_DISTURB = 0,
        /**
         * 提醒。
         */
        NOTIFY = 1,
    }
    enum ConversationType {
        NONE = 0,
        PRIVATE = 1,
        DISCUSSION = 2,
        GROUP = 3,
        CHATROOM = 4,
        CUSTOMER_SERVICE = 5,
        SYSTEM = 6,
        APP_PUBLIC_SERVICE = 7,
        PUBLIC_SERVICE = 8,
    }
    enum DiscussionInviteStatus {
        /**
         * 开放邀请。
         */
        OPENED = 0,
        /**
         * 关闭邀请。
         */
        CLOSED = 1,
    }
    enum ErrorCode {
        TIMEOUT = -1,
        /**
         * 未知原因失败。
         */
        UNKNOWN = -2,
        /**
         * 发送频率过快
         */
        SEND_FREQUENCY_TOO_FAST = 20604,
        /**
         * 不在讨论组。
         */
        NOT_IN_DISCUSSION = 21406,
        /**
         * 加入讨论失败
         */
        JOIN_IN_DISCUSSION = 21407,
        /**
         * 创建讨论组失败
         */
        CREATE_DISCUSSION = 21408,
        /**
         * 设置讨论组邀请状态失败
         */
        INVITE_DICUSSION = 21409,
        /**
         * 不在群组。
         */
        NOT_IN_GROUP = 22406,
        /**
         * 不在聊天室。
         */
        NOT_IN_CHATROOM = 23406,
        /**
         *获取用户失败
         */
        GET_USERINFO_ERROR = 23407,
        /**
         *获取用户失败
         */
        FORBIDDEN_IN_CHATROOM = 23408,
        /**
         * 在黑名单中。
         */
        REJECTED_BY_BLACKLIST = 405,
        /**
         * 通信过程中，当前 Socket 不存在。
         */
        RC_NET_CHANNEL_INVALID = 30001,
        /**
         * Socket 连接不可用。
         */
        RC_NET_UNAVAILABLE = 30002,
        /**
         * 通信超时。
         */
        RC_MSG_RESP_TIMEOUT = 30003,
        /**
         * 导航操作时，Http 请求失败。
         */
        RC_HTTP_SEND_FAIL = 30004,
        /**
         * HTTP 请求失败。
         */
        RC_HTTP_REQ_TIMEOUT = 30005,
        /**
         * HTTP 接收失败。
         */
        RC_HTTP_RECV_FAIL = 30006,
        /**
         * 导航操作的 HTTP 请求，返回不是200。
         */
        RC_NAVI_RESOURCE_ERROR = 30007,
        /**
         * 导航数据解析后，其中不存在有效数据。
         */
        RC_NODE_NOT_FOUND = 30008,
        /**
         * 导航数据解析后，其中不存在有效 IP 地址。
         */
        RC_DOMAIN_NOT_RESOLVE = 30009,
        /**
         * 创建 Socket 失败。
         */
        RC_SOCKET_NOT_CREATED = 30010,
        /**
         * Socket 被断开。
         */
        RC_SOCKET_DISCONNECTED = 30011,
        /**
         * PING 操作失败。
         */
        RC_PING_SEND_FAIL = 30012,
        /**
         * PING 超时。
         */
        RC_PONG_RECV_FAIL = 30013,
        /**
         * 消息发送失败。
         */
        RC_MSG_SEND_FAIL = 30014,
        /**
         * 做 connect 连接时，收到的 ACK 超时。
         */
        RC_CONN_ACK_TIMEOUT = 31000,
        /**
         * 参数错误。
         */
        RC_CONN_PROTO_VERSION_ERROR = 31001,
        /**
         * 参数错误，App Id 错误。
         */
        RC_CONN_ID_REJECT = 31002,
        /**
         * 服务器不可用。
         */
        RC_CONN_SERVER_UNAVAILABLE = 31003,
        /**
         * Token 错误。
         */
        RC_CONN_USER_OR_PASSWD_ERROR = 31004,
        /**
         * App Id 与 Token 不匹配。
         */
        RC_CONN_NOT_AUTHRORIZED = 31005,
        /**
         * 重定向，地址错误。
         */
        RC_CONN_REDIRECTED = 31006,
        /**
         * NAME 与后台注册信息不一致。
         */
        RC_CONN_PACKAGE_NAME_INVALID = 31007,
        /**
         * APP 被屏蔽、删除或不存在。
         */
        RC_CONN_APP_BLOCKED_OR_DELETED = 31008,
        /**
         * 用户被屏蔽。
         */
        RC_CONN_USER_BLOCKED = 31009,
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        RC_DISCONN_KICK = 31010,
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        RC_DISCONN_EXCEPTION = 31011,
        /**
         * 协议层内部错误。query，上传下载过程中数据错误。
         */
        RC_QUERY_ACK_NO_DATA = 32001,
        /**
         * 协议层内部错误。
         */
        RC_MSG_DATA_INCOMPLETE = 32002,
        /**
         * 未调用 init 初始化函数。
         */
        BIZ_ERROR_CLIENT_NOT_INIT = 33001,
        /**
         * 数据库初始化失败。
         */
        BIZ_ERROR_DATABASE_ERROR = 33002,
        /**
         * 传入参数无效。
         */
        BIZ_ERROR_INVALID_PARAMETER = 33003,
        /**
         * 通道无效。
         */
        BIZ_ERROR_NO_CHANNEL = 33004,
        /**
         * 重新连接成功。
         */
        BIZ_ERROR_RECONNECT_SUCCESS = 33005,
        /**
         * 连接中，再调用 connect 被拒绝。
         */
        BIZ_ERROR_CONNECTING = 33006,
        /**
         * 消息漫游服务未开通
         */
        MSG_ROAMING_SERVICE_UNAVAILABLE = 33007,
        /**
         * 群组被禁言
         */
        FORBIDDEN_IN_GROUP = 22408,
        /**
         * 删除会话失败
         */
        CONVER_REMOVE_ERROR = 34001,
        /**
         *拉取历史消息
         */
        CONVER_GETLIST_ERROR = 34002,
        /**
         * 会话指定异常
         */
        CONVER_SETOP_ERROR = 34003,
        /**
         * 获取会话未读消息总数失败
         */
        CONVER_TOTAL_UNREAD_ERROR = 34004,
        /**
         * 获取指定会话类型未读消息数异常
         */
        CONVER_TYPE_UNREAD_ERROR = 34005,
        /**
         * 获取指定用户ID&会话类型未读消息数异常
         */
        CONVER_ID_TYPE_UNREAD_ERROR = 34006,
        /**
         *
         */
        GROUP_SYNC_ERROR = 35001,
        /**
         * 匹配群信息系异常
         */
        GROUP_MATCH_ERROR = 35002,
        /**
         * 加入聊天室Id为空
         */
        CHATROOM_ID_ISNULL = 36001,
        /**
         * 加入聊天室失败
         */
        CHARTOOM_JOIN_ERROR = 36002,
        /**
         * 拉取聊天室历史消息失败
         */
        CHATROOM_HISMESSAGE_ERROR = 36003,
        /**
         * 加入黑名单异常
         */
        BLACK_ADD_ERROR = 37001,
        /**
         * 获得指定人员再黑名单中的状态异常
         */
        BLACK_GETSTATUS_ERROR = 37002,
        /**
         * 移除黑名单异常
         */
        BLACK_REMOVE_ERROR = 37003,
        /**
         * 获取草稿失败
         */
        DRAF_GET_ERROR = 38001,
        /**
         * 保存草稿失败
         */
        DRAF_SAVE_ERROR = 38002,
        /**
         * 删除草稿失败
         */
        DRAF_REMOVE_ERROR = 38003,
        /**
         * 关注公众号失败
         */
        SUBSCRIBE_ERROR = 39001,
        /**
         * 关注公众号失败
         */
        QNTKN_FILETYPE_ERROR = 41001,
        /**
         * 获取七牛token失败
         */
        QNTKN_GET_ERROR = 41002,
        /**
         * cookie被禁用
         */
        COOKIE_ENABLE = 51001,
    }
    enum MediaType {
        /**
         * 图片。
         */
        IMAGE = 1,
        /**
         * 声音。
         */
        AUDIO = 2,
        /**
         * 视频。
         */
        VIDEO = 3,
        /**
         * 通用文件。
         */
        FILE = 100,
    }
    enum MessageDirection {
        /**
         * 发送消息。
         */
        SEND = 1,
        /**
         * 接收消息。
         */
        RECEIVE = 2,
    }
    enum FileType {
        IMAGE = 1,
        AUDIO = 2,
        VIDEO = 3,
    }
    enum RealTimeLocationErrorCode {
        /**
         * 未初始化 RealTimeLocation 实例
         */
        RC_REAL_TIME_LOCATION_NOT_INIT = -1,
        /**
         * 执行成功。
         */
        RC_REAL_TIME_LOCATION_SUCCESS = 0,
        /**
         * 获取 RealTimeLocation 实例时返回
         * GPS 未打开。
         */
        RC_REAL_TIME_LOCATION_GPS_DISABLED = 1,
        /**
         * 获取 RealTimeLocation 实例时返回
         * 当前会话不支持位置共享。
         */
        RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT = 2,
        /**
         * 获取 RealTimeLocation 实例时返回
         * 对方已发起位置共享。
         */
        RC_REAL_TIME_LOCATION_IS_ON_GOING = 3,
        /**
         * Join 时返回
         * 当前位置共享已超过最大支持人数。
         */
        RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT = 4,
        /**
         * Join 时返回
         * 加入位置共享失败。
         */
        RC_REAL_TIME_LOCATION_JOIN_FAILURE = 5,
        /**
         * Start 时返回
         * 发起位置共享失败。
         */
        RC_REAL_TIME_LOCATION_START_FAILURE = 6,
        /**
         * 网络不可用。
         */
        RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE = 7,
    }
    enum RealTimeLocationStatus {
        /**
         * 空闲状态 （默认状态）
         * 对方或者自己都未发起位置共享业务，或者位置共享业务已结束。
         */
        RC_REAL_TIME_LOCATION_STATUS_IDLE = 0,
        /**
         * 呼入状态 （待加入）
         * 1. 对方发起了位置共享业务，此状态下，自己只能选择加入。
         * 2. 自己从已连接的位置共享中退出。
         */
        RC_REAL_TIME_LOCATION_STATUS_INCOMING = 1,
        /**
         * 呼出状态 =（自己创建）
         * 1. 自己发起位置共享业务，对方只能选择加入。
         * 2. 对方从已连接的位置共享业务中退出。
         */
        RC_REAL_TIME_LOCATION_STATUS_OUTGOING = 2,
        /**
         * 连接状态 （自己加入）
         * 对方加入了自己发起的位置共享，或者自己加入了对方发起的位置共享。
         */
        RC_REAL_TIME_LOCATION_STATUS_CONNECTED = 3,
    }
    enum ReceivedStatus {
        READ = 1,
        LISTENED = 2,
        DOWNLOADED = 4,
    }
    enum SearchType {
        /**
         * 精确。
         */
        EXACT = 0,
        /**
         * 模糊。
         */
        FUZZY = 1,
    }
    enum SentStatus {
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
    enum ConnectionState {
        ACCEPTED = 0,
        UNACCEPTABLE_PROTOCOL_VERSION = 1,
        IDENTIFIER_REJECTED = 2,
        SERVER_UNAVAILABLE = 3,
        /**
         * token无效
         */
        TOKEN_INCORRECT = 4,
        NOT_AUTHORIZED = 5,
        REDIRECT = 6,
        PACKAGE_ERROR = 7,
        APP_BLOCK_OR_DELETE = 8,
        BLOCK = 9,
        TOKEN_EXPIRE = 10,
        DEVICE_ERROR = 11,
    }
}
declare module RongIMLib {
    class RongIMEmoji {
        static emojis: any[];
        private static emojiFactory;
        private static regExpTag;
        private static regExpName;
        private static size;
        private static url;
        /**
         * 是否支持高清屏幕
         */
        private static pixelRatio;
        /**
         * 判断是否支持emoji
         */
        private static supportEmoji;
        /**
         * 初始化CSS
         */
        private static initCSS();
        private static createBTag(position);
        private static createSpan(emojiObj);
        private static calculateUTF(d);
        static init(emoji?: any): void;
        static emojiToSymbol(str: string): string;
        /**
         * 获取Emoji对象 发送消息使用
         * @param  {string}     name  emoji名称
         */
        static symbolToEmoji(str: string): string;
        /**
         * @param  {string} str 字符串
         */
        static symbolToHTML(str: string): string;
        /**
         * 转换字符串中的emoji 接收消息使用
         * @param  {string} str      包含emoji的字符串
         */
        static emojiToHTML(str: string): string;
    }
}
declare module RongIMLib {
    class RongIMVoice {
        private static isIE;
        private static element;
        private static isInit;
        static init(): void;
        static play(data: string, duration: number): void;
        static stop(base64Data: string): void;
        static preLoaded(base64Data: string): void;
        private static palyVoice(base64Data);
        static onprogress(): void;
        private static checkInit(position);
        private static thisMovie();
        private static onCompleted(duration);
        private static base64ToBlob(base64Data, type);
    }
}
declare module RongIMLib {
    class RongIMClient {
        /**
         * [schemeType 选择连接方式]
         * SSL自动设置schemeType为ConnectionChannel.HTTPS
         * HTTP或WS自动设置 schemeType为ConnectionChannel.HTTP
         * @type {number}
         */
        static schemeType: number;
        static MessageType: {
            [s: string]: any;
        };
        static MessageParams: {
            [s: string]: any;
        };
        static RegisterMessage: {
            [s: string]: any;
        };
        static _memoryStore: any;
        static isNotPullMsg: boolean;
        static _cookieHelper: CookieProvider;
        static _dataAccessProvider: DataAccessProvider;
        private static _instance;
        private static bridge;
        static getInstance(): RongIMClient;
        /**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         * @param dataAccessProvider 必须是DataAccessProvider的实例
         */
        static init(appKey: string, dataAccessProvider?: DataAccessProvider): void;
        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        static connect(token: string, callback: ConnectCallback): RongIMClient;
        static reconnect(callback: ConnectCallback): void;
        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param objectName  消息内置名称
         */
        static registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;
        /**
         * 设置连接状态变化的监听器。
         *
         * @param listener  连接状态变化的监听器。
         */
        static setConnectionStatusListener(listener: ConnectionStatusListener): void;
        /**
         * 设置接收消息的监听器。
         *
         * @param listener  接收消息的监听器。
         */
        static setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;
        /**
         * 清理所有连接相关的变量
         */
        logout(): void;
        /**
         * 断开连接。
         */
        disconnect(): void;
        startCustomService(custId: string, callback: any): void;
        stopCustomeService(custId: string, callback: any): void;
        switchToHumanMode(custId: string, callback: any): void;
        evaluateRebotCustomService(custId: string, isRobotResolved: boolean, sugest: string, callback: any): void;
        evaluateHumanCustomService(custId: string, humanValue: number, sugest: string, callback: any): void;
        setCustomerWelcome(robotWelcome: string, humanWelcome: string): void;
        private sendCustMessage(custId, msg, callback);
        /**
         * 获取当前连接的状态。
         */
        getCurrentConnectionStatus(): ConnectionStatus;
        /**
         * 获取当前使用的连接通道。
         */
        getConnectionChannel(): ConnectionChannel;
        /**
         * 获取当前使用的本地储存提供者。 TODO
         */
        getStorageProvider(): string;
        /**
         * 过滤聊天室消息（拉取最近聊天消息）
         * @param {string[]} msgFilterNames
         */
        setFilterMessages(msgFilterNames: string[]): void;
        /**
         * 获取当前连接用户的 UserId。
         */
        getCurrentUserId(): string;
        /**
         * [getCurrentUserInfo 获取当前用户信息]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        /**
         * 获得用户信息
         * @param  {string}                   userId [用户Id]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        /**
         * 获取服务器时间与本地时间的差值，单位为毫秒。
         * 计算公式：差值 = 本地时间毫秒数 - 服务器时间毫秒数
         * @param callback  获取的回调，返回差值。
         */
        getDeltaTime(): number;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        /**TODO 清楚本地存储的未读消息，目前清空内存中的未读消息
         * [clearMessagesUnreadStatus 清空指定会话未读消息]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [用户id]
         * @param  {ResultCallback<boolean>} callback         [返回值，参数回调]
         */
        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        /**TODO
         * [deleteMessages 删除消息记录。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {number[]}                messageIds       [description]
         * @param  {ResultCallback<boolean>} callback         [description]
         */
        deleteMessages(conversationType: ConversationType, targetId: string, messageIds: string[], callback: ResultCallback<boolean>): void;
        sendLocalMessage(message: Message, callback: SendMessageCallback): void;
        /**
         * [sendMessage 发送消息。]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {MessageContent}          messageContent   [消息类型]
         * @param  {SendMessageCallback}     sendCallback     []
         * @param  {ResultCallback<Message>} resultCallback   [返回值，函数回调]
         * @param  {string}                  pushContent      []
         * @param  {string}                  pushData         []
         */
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback): void;
        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;
        /**
         * [sendStatusMessage description]
         * @param  {MessageContent}          messageContent [description]
         * @param  {SendMessageCallback}     sendCallback   [description]
         * @param  {ResultCallback<Message>} resultCallback [description]
         */
        sendStatusMessage(messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>): void;
        /**
         * [sendTextMessage 发送TextMessage快捷方式]
         * @param  {string}                  content        [消息内容]
         * @param  {ResultCallback<Message>} resultCallback [返回值，参数回调]
         */
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;
        /**
         * [insertMessage 向本地插入一条消息，不发送到服务器。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {string}                  senderUserId     [description]
         * @param  {MessageContent}          content          [description]
         * @param  {ResultCallback<Message>} callback         [description]
         */
        insertMessage(conversationType: ConversationType, targetId: string, senderUserId: string, content: Message, callback: ResultCallback<Message>): void;
        /**
         * [getHistoryMessages 拉取历史消息记录。]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        /**
         * [getRemoteHistoryMessages 拉取某个时间戳之前的消息]
         * @param  {ConversationType}          conversationType [description]
         * @param  {string}                    targetId         [description]
         * @param  {Date}                      dateTime         [description]
         * @param  {number}                    count            [description]
         * @param  {ResultCallback<Message[]>} callback         [description]
         */
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        /**
         * [hasRemoteUnreadMessages 是否有未接收的消息，jsonp方法]
         * @param  {string}          appkey   [appkey]
         * @param  {string}          token    [token]
         * @param  {ConnectCallback} callback [返回值，参数回调]
         */
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;
        getTotalUnreadCount(callback: ResultCallback<number>): void;
        /**
         * [getConversationUnreadCount 指定多种会话类型获取未读消息数]
         * @param  {ResultCallback<number>} callback             [返回值，参数回调。]
         * @param  {ConversationType[]}     ...conversationTypes [会话类型。]
         */
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        /**
         * [getUnreadCount 指定用户、会话类型的未读消息总数。]
         * @param  {ConversationType} conversationType [会话类型]
         * @param  {string}           targetId         [用户Id]
         */
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        /**
         * 清楚会话未读消息数
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {ResultCallback<boolean>} callback         返回值，函数回调
         */
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
        /**
         * clearTextMessageDraft 清除指定会话和消息类型的草稿。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         */
        clearTextMessageDraft(conversationType: ConversationType, targetId: string): boolean;
        /**
         * [getTextMessageDraft 获取指定消息和会话的草稿。]
         * @param  {ConversationType}       conversationType [会话类型]
         * @param  {string}                 targetId         [目标Id]
         */
        getTextMessageDraft(conversationType: ConversationType, targetId: string): string;
        /**
         * [saveTextMessageDraft description]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {string}                  value            [草稿值]
         */
        saveTextMessageDraft(conversationType: ConversationType, targetId: string, value: string): boolean;
        clearConversations(callback: ResultCallback<boolean>, ...conversationTypes: ConversationType[]): void;
        /**
         * [getConversation 获取指定会话，此方法需在getConversationList之后执行]
         * @param  {ConversationType}             conversationType [会话类型]
         * @param  {string}                       targetId         [目标Id]
         * @param  {ResultCallback<Conversation>} callback         [返回值，函数回调]
         */
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;
        /**
         * [pottingConversation 组装会话列表]
         * @param {any} tempConver [临时会话]
         * conver_conversationType_targetId_no.
         * msg_conversationType_targetId_no.
         */
        private pottingConversation(tempConver);
        private sortConversationList(conversationList);
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[]): void;
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[]): void;
        /**
         * [createConversation 创建会话。]
         * @param  {number}  conversationType [会话类型]
         * @param  {string}  targetId         [目标Id]
         * @param  {string}  converTitle      [会话标题]
         * @param  {boolean} islocal          [是否同步到服务器，ture：同步，false:不同步]
         */
        createConversation(conversationType: number, targetId: string, converTitle: string): Conversation;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        /**
         * [getConversationNotificationStatus 获取指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        getConversationNotificationStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<ConversationNotificationStatus>): void;
        /**
         * [setConversationNotificationStatus 设置指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        setConversationNotificationStatus(conversationType: ConversationType, targetId: string, notificationStatus: ConversationNotificationStatus, callback: ResultCallback<ConversationNotificationStatus>): void;
        /**
         * [getNotificationQuietHours 获取免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        getNotificationQuietHours(callback: GetNotificationQuietHoursCallback): void;
        /**
         * [removeNotificationQuietHours 移除免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        removeNotificationQuietHours(callback: OperationCallback): void;
        /**
         * [setNotificationQuietHours 设置免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        setNotificationQuietHours(startTime: string, spanMinutes: number, callback: OperationCallback): void;
        /**
         * [addMemberToDiscussion   加入讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string[]}          userIdList   [讨论中成员]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;
        /**
         * [createDiscussion 创建讨论组]
         * @param  {string}                   name       [讨论组名称]
         * @param  {string[]}                 userIdList [讨论组成员]
         * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
         */
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;
        /**
         * [getDiscussion 获取讨论组信息]
         * @param  {string}                     discussionId [讨论组Id]
         * @param  {ResultCallback<Discussion>} callback     [返回值，函数回调]
         */
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;
        /**
         * [quitDiscussion 退出讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        quitDiscussion(discussionId: string, callback: OperationCallback): void;
        /**
         * [removeMemberFromDiscussion 将指定成员移除讨论租]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            userId       [被移除的用户Id]
         * @param  {OperationCallback} callback     [返回值，参数回调]
         */
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;
        /**
         * [setDiscussionInviteStatus 设置讨论组邀请状态]
         * @param  {string}                 discussionId [讨论组Id]
         * @param  {DiscussionInviteStatus} status       [邀请状态]
         * @param  {OperationCallback}      callback     [返回值，函数回调]
         */
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;
        /**
         * [setDiscussionName 设置讨论组名称]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            name         [讨论组名称]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;
        /**
         * [加入群组]
         * @param  {string}            groupId   [群组Id]
         * @param  {string}            groupName [群组名称]
         * @param  {OperationCallback} callback  [返回值，函数回调]
         */
        joinGroup(groupId: string, groupName: string, callback: OperationCallback): void;
        /**
         * [退出群组]
         * @param  {string}            groupId  [群组Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        quitGroup(groupId: string, callback: OperationCallback): void;
        /**
         * [同步群组信息]
         * @param  {Array<Group>}      groups   [群组列表]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        syncGroup(groups: Array<Group>, callback: OperationCallback): void;
        /**
         * [加入聊天室。]
         * @param  {string}            chatroomId   [聊天室Id]
         * @param  {number}            messageCount [拉取消息数量，-1为不拉去消息]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;
        /**
         * [退出聊天室]
         * @param  {string}            chatroomId [聊天室Id]
         * @param  {OperationCallback} callback   [返回值，函数回调]
         */
        quitChatRoom(chatroomId: string, callback: OperationCallback): void;
        getRemotePublicServiceList(mpId?: string, conversationType?: number, pullMessageTime?: any, callback?: ResultCallback<PublicServiceProfile[]>): void;
        /**
         * [getPublicServiceList ]获取已经的公共账号列表
         * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
         */
        getPublicServiceList(callback: ResultCallback<PublicServiceProfile[]>): void;
        /**
         * [getPublicServiceProfile ]   获取某公共服务信息。
         * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
         * @param  {string}                               publicServiceId   [公共服务 Id。]
         * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
         */
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>): void;
        /**
         * [pottingPublicSearchType ] 公众好查询类型
         * @param  {number} bussinessType [ 0-all 1-mp 2-mc]
         * @param  {number} searchType    [0-exact 1-fuzzy]
         */
        private pottingPublicSearchType(bussinessType, searchType);
        /**
         * [searchPublicService ]按公众服务类型搜索公众服务。
         * @param  {SearchType}                             searchType [搜索类型枚举。]
         * @param  {string}                                 keywords   [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback   [搜索结果回调。]
         */
        searchPublicService(searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>): void;
        /**
         * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
         * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
         * @param  {SearchType}                             searchType        [搜索类型枚举。]
         * @param  {string}                                 keywords          [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
         */
        searchPublicServiceByType(publicServiceType: ConversationType, searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>): void;
        /**
         * [subscribePublicService ] 订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [订阅公众号回调。]
         */
        subscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback): void;
        /**
         * [unsubscribePublicService ] 取消订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [取消订阅公众号回调。]
         */
        unsubscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback): void;
        /**
         * [加入黑名单]
         * @param  {string}            userId   [将被加入黑名单的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        addToBlacklist(userId: string, callback: OperationCallback): void;
        /**
         * [获取黑名单列表]
         * @param  {GetBlacklistCallback} callback [返回值，函数回调]
         */
        getBlacklist(callback: GetBlacklistCallback): void;
        /**
         * [得到指定人员再黑名单中的状态]
         * @param  {string}                          userId   [description]
         * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
         */
        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;
        /**
         * [将指定用户移除黑名单]
         * @param  {string}            userId   [将被移除的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        removeFromBlacklist(userId: string, callback: OperationCallback): void;
        getFileToken(fileType: FileType, callback: ResultCallback<{ token: string }>): void;
        getFileUrl(fileType: FileType, fileName: String, callback: ResultCallback<{ downloadUrl: string }>): void;
        addRealTimeLocationListener(conversationType: ConversationType, targetId: string, listener: RealTimeLocationListener): void;
        getRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        getRealTimeLocationCurrentState(conversationType: ConversationType, targetId: string): void;
        getRealTimeLocationParticipants(conversationType: ConversationType, targetId: string): void;
        joinRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        quitRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        startRealTimeLocation(conversationType: ConversationType, targetId: string): void;
        updateRealTimeLocationStatus(conversationType: ConversationType, targetId: string, latitude: number, longitude: number): void;
    }
}
declare module RongIMLib {
    enum Qos {
        AT_MOST_ONCE = 0,
        AT_LEAST_ONCE = 1,
        EXACTLY_ONCE = 2,
        DEFAULT = 3,
    }
    enum Type {
        CONNECT = 1,
        CONNACK = 2,
        PUBLISH = 3,
        PUBACK = 4,
        QUERY = 5,
        QUERYACK = 6,
        QUERYCON = 7,
        SUBSCRIBE = 8,
        SUBACK = 9,
        UNSUBSCRIBE = 10,
        UNSUBACK = 11,
        PINGREQ = 12,
        PINGRESP = 13,
        DISCONNECT = 14,
    }
    class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
        static _ReceiveMessageListener: any;
        connectionStatus: number;
        url: string;
        self: any;
        constructor(address: any, cb: any, self: Client);
        writeAndFlush(val: any): void;
        reconnect(callback: any): void;
        disconnect(status: number): void;
    }
    class Socket {
        static XHR_POLLING: string;
        static WEBSOCKET: string;
        socket: any;
        _events: any;
        currentURL: string;
        static getInstance(): Socket;
        connect(url: string, cb: any): any;
        createServer(): any;
        getTransport(transportType: string): any;
        send(data: any): void;
        onMessage(data: any): void;
        disconnect(status: number): any;
        reconnect(): any;
        /**
         * [checkTransport 返回通道类型]
         * WEB_XHR_POLLING:是否选择comet方式进行连接
         */
        checkTransport(): string;
        fire(x: any, args?: any): any;
        on(x: any, func: any): any;
        removeEvent(x: any, fn: any): any;
        _encode(x: any): {
            url: string;
            data: any;
        };
    }
    class Client {
        timeoutMillis: number;
        timeout_: number;
        appId: string;
        token: string;
        sdkVer: string;
        apiVer: any;
        channel: Channel;
        handler: any;
        userId: string;
        reconnectObj: any;
        heartbeat: any;
        chatroomId: string;
        static userInfoMapping: any;
        SyncTimeQueue: any;
        constructor(token: string, appId: string);
        resumeTimer(): void;
        pauseTimer(): void;
        connect(_callback: any): void;
        keepLive(): void;
        clearHeartbeat(): void;
        publishMessage(_topic: any, _data: any, _targetId: any, _callback: any, _msg: any): void;
        queryMessage(_topic: string, _data: any, _targetId: string, _qos: any, _callback: any, pbtype: any): void;
        invoke(isPullMsg?: boolean): void;
        syncTime(_type?: any, pullTime?: any): void;
        __init(f: any): void;
    }
    class Bridge {
        static _client: Client;
        static getInstance(): Bridge;
        connect(appKey: string, token: string, callback: any): Client;
        setListener(_changer: any): void;
        reconnect(callabck: any): void;
        disconnect(): void;
        queryMsg(topic: any, content: any, targetId: string, callback: any, pbname?: string): void;
        pubMsg(topic: number, content: string, targetId: string, callback: any, msg: any): void;
    }
    class MessageHandler {
        map: any;
        syncMsgMap: any;
        _onReceived: any;
        connectCallback: any;
        _client: Client;
        constructor(client: Client);
        putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any;
        setConnectCallback(_connectCallback: any): void;
        onReceived(msg: any, pubAckItem?: any): void;
        handleMessage(msg: any): void;
    }
}
declare module RongIMLib {
    class MessageCallback {
        timeoutMillis: number;
        timeout: any;
        onError: any;
        constructor(error: any);
        resumeTimer(): void;
        pauseTimer(): void;
        readTimeOut(isTimeout: boolean): void;
    }
    class CallbackMapping {
        publicServiceList: Array<PublicServiceProfile>;
        profile: PublicServiceProfile;
        static getInstance(): CallbackMapping;
        pottingProfile(item: any): void;
        mapping(entity: any, tag: string): any;
    }
    class PublishCallback extends MessageCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any);
        process(_status: number, messageUId: string, timestamp: number, _msg: any): void;
        readTimeOut(x?: any): void;
    }
    class QueryCallback extends MessageCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any);
        process(status: number, data: any, serverTime: any, pbtype: any): void;
        readTimeOut(x?: any): void;
    }
    class ConnectAck extends MessageCallback {
        _client: Client;
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any, client: Client);
        process(status: number, userId: string, timestamp: number): void;
        readTimeOut(x?: any): void;
    }
}
declare module RongIMLib {
    class Navigation {
        static Endpoint: any;
        constructor();
        connect(appId?: string, token?: string, callback?: any): Client;
        getServerEndpoint(_token: string, _appId: string, _onsuccess?: any, _onerror?: any, unignore?: any): void;
    }
}
declare module RongIMLib {
    /**
     * 消息基类
     */
    class BaseMessage {
        _name: string;
        _header: Header;
        _headerCode: any;
        lengthSize: any;
        constructor(arg: any);
        read(In: any, length: number): void;
        write(Out: any): any;
        getHeaderFlag(): any;
        getLengthSize(): any;
        toBytes(): any;
        isRetained(): boolean;
        setRetained(retain: any): void;
        setQos(qos: any): void;
        setDup(dup: boolean): void;
        isDup(): boolean;
        getType(): number;
        getQos(): any;
        messageLength(): number;
        writeMessage(out: any): void;
        readMessage(In: any, length: number): void;
        init(args: any): void;
    }
    /**
     *连接消息类型
     */
    class ConnectMessage extends BaseMessage {
        _name: string;
        CONNECT_HEADER_SIZE: number;
        protocolId: string;
        binaryHelper: BinaryHelper;
        protocolVersion: number;
        clientId: any;
        keepAlive: any;
        appId: any;
        token: any;
        cleanSession: any;
        willTopic: any;
        will: any;
        willQos: any;
        retainWill: any;
        hasAppId: any;
        hasToken: any;
        hasWill: any;
        constructor(header: RongIMLib.Header);
        messageLength(): number;
        readMessage(stream: any): any;
        writeMessage(out: any): RongIMStream;
    }
    /**
     *连接应答类型
     */
    class ConnAckMessage extends BaseMessage {
        _name: string;
        status: any;
        userId: string;
        MESSAGE_LENGTH: number;
        timestrap: number;
        binaryHelper: BinaryHelper;
        constructor(header: any);
        messageLength(): number;
        readMessage(_in: RongIMStream, msglength: number): void;
        writeMessage(out: any): RongIMStream;
        setStatus(x: any): void;
        setUserId(_userId: string): void;
        getStatus(): any;
        getUserId(): string;
        setTimestamp(x: number): void;
        getTimestamp(): number;
    }
    /**
     *断开消息类型
     */
    class DisconnectMessage extends BaseMessage {
        _name: string;
        status: any;
        MESSAGE_LENGTH: number;
        binaryHelper: BinaryHelper;
        constructor(header: any);
        messageLength(): number;
        readMessage(_in: any): void;
        writeMessage(Out: any): void;
        setStatus(x: any): void;
        getStatus(): any;
    }
    /**
     *请求消息信令
     */
    class PingReqMessage extends BaseMessage {
        _name: string;
        constructor(header?: RongIMLib.Header);
    }
    /**
     *响应消息信令
     */
    class PingRespMessage extends BaseMessage {
        _name: string;
        constructor(header: RongIMLib.Header);
    }
    /**
     *封装MesssageId
     */
    class RetryableMessage extends BaseMessage {
        _name: string;
        messageId: any;
        binaryHelper: BinaryHelper;
        constructor(argu: any);
        messageLength(): number;
        writeMessage(Out: any): any;
        readMessage(_in: any, msgLength?: number): void;
        setMessageId(_messageId: number): void;
        getMessageId(): any;
    }
    /**
     *发送消息应答（双向）
     *qos为1必须给出应答（所有消息类型一样）
     */
    class PubAckMessage extends RetryableMessage {
        status: any;
        msgLen: number;
        date: number;
        millisecond: number;
        messageUId: string;
        timestamp: number;
        binaryHelper: BinaryHelper;
        _name: string;
        constructor(header: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setStatus(x: any): void;
        setTimestamp(timestamp: number): void;
        setMessageUId(messageUId: string): void;
        getStatus(): any;
        getDate(): number;
        getTimestamp(): number;
        getMessageUId(): string;
    }
    /**
     *发布消息
     */
    class PublishMessage extends RetryableMessage {
        _name: string;
        topic: any;
        data: any;
        targetId: string;
        date: any;
        binaryHelper: BinaryHelper;
        syncMsg: boolean;
        constructor(header: any, two?: any, three?: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setTopic(x: any): void;
        setData(x: any): void;
        setTargetId(x: any): void;
        setDate(x: any): void;
        setSyncMsg(x: boolean): void;
        getSyncMsg(): boolean;
        getTopic(): any;
        getData(): any;
        getTargetId(): string;
        getDate(): any;
    }
    /**
     *请求查询
     */
    class QueryMessage extends RetryableMessage {
        topic: any;
        data: any;
        targetId: any;
        binaryHelper: BinaryHelper;
        _name: string;
        constructor(header: any, two?: any, three?: any);
        messageLength(): number;
        writeMessage(Out: any): void;
        readMessage(_in: any, msgLength: number): void;
        setTopic(x: any): void;
        setData(x: any): void;
        setTargetId(x: any): void;
        getTopic(): any;
        getData(): any;
        getTargetId(): any;
    }
    /**
     *请求查询确认
     */
    class QueryConMessage extends RetryableMessage {
        _name: string;
        constructor(messageId: any);
    }
    /**
     *请求查询应答
     */
    class QueryAckMessage extends RetryableMessage {
        _name: string;
        data: any;
        status: any;
        date: any;
        binaryHelper: BinaryHelper;
        constructor(header: RongIMLib.Header);
        readMessage(In: any, msgLength: number): void;
        getData(): any;
        getStatus(): any;
        getDate(): any;
        setDate(x: any): void;
        setStatus(x: any): void;
        setData(x: any): void;
    }
}
declare module RongIMLib {
    /**
     * 把消息对象写入流中
     * 发送消息时用到
     */
    class MessageOutputStream {
        out: RongIMLib.RongIMStream;
        constructor(_out: any);
        writeMessage(msg: RongIMLib.BaseMessage): void;
    }
    /**
     * 流转换为消息对象
     * 服务器返回消息时用到
     */
    class MessageInputStream {
        msg: any;
        flags: any;
        header: any;
        isPolling: boolean;
        In: any;
        _in: any;
        constructor(In: any, isPolling?: boolean);
        readMessage(): any;
    }
    class Header {
        type: number;
        retain: boolean;
        qos: any;
        dup: boolean;
        syncMsg: boolean;
        constructor(_type: any, _retain?: any, _qos?: any, _dup?: any);
        getSyncMsg(): boolean;
        getType(): number;
        encode(): any;
        toString(): string;
    }
    /**
     * 二进制帮助对象
     */
    class BinaryHelper {
        writeUTF(str: string, isGetBytes?: any): any;
        readUTF(arr: any): string;
        /**
         * [convertStream 将参数x转化为RongIMStream对象]
         * @param  {any}    x [参数]
         */
        convertStream(x: any): RongIMStream;
        toMQttString(str: string): any;
    }
    class RongIMStream {
        pool: any;
        position: number;
        writen: number;
        poolLen: number;
        binaryHelper: BinaryHelper;
        constructor(arr: any);
        check(): boolean;
        readInt(): number;
        readLong(): number;
        readTimestamp(): number;
        readUTF(): any;
        readByte(): any;
        read(bytesArray?: any): any;
        write(_byte: any): any;
        writeChar(v: any): void;
        writeUTF(str: string): void;
        toComplements(): any;
        getBytesArray(isCom: boolean): any;
    }
}
declare module RongIMLib {
    interface Transportation {
        createTransport(url: string, method: string): any;
        send(data: any, url?: string, method?: string): any;
        onData(data?: any): string;
        onClose(ev?: any): any;
        onError(error: any): void;
        disconnect(): void;
    }
}
declare module RongIMLib {
    class SocketTransportation implements Transportation {
        url: string;
        connected: boolean;
        isClose: boolean;
        socket: WebSocket;
        queue: Array<any>;
        empty: any;
        _socket: Socket;
        _status: number;
        /**
         * [constructor]
         * @param  {string} url [连接地址：包含token、version]
         */
        constructor(_socket: Socket);
        /**
         * [createTransport 创建WebScoket对象]
         */
        createTransport(url: string, method?: string): any;
        /**
         * [send 传送消息流]
         * @param  {ArrayBuffer} data [二进制消息流]
         */
        send(data: any): any;
        /**
         * [onData 通道返回数据时调用的方法，用来想上层传递服务器返回的二进制消息流]
         * @param  {ArrayBuffer}    data [二进制消息流]
         */
        onData(data: any): string;
        /**
         * [onClose 通道关闭时触发的方法]
         */
        onClose(ev: any): any;
        /**
         * [onError 通道报错时触发的方法]
         * @param {any} error [抛出异常]
         */
        onError(error: any): void;
        /**
         * [addEvent 为通道绑定事件]
         */
        addEvent(): void;
        /**
         * [doQueue 消息队列，把队列中消息发出]
         */
        doQueue(): void;
        /**
         * [disconnect 断开连接]
         */
        disconnect(status?: number): void;
        /**
         * [reconnect 重新连接]
         */
        reconnect(): void;
    }
}
declare module RongIMLib {
    class PollingTransportation implements Transportation {
        empty: Function;
        queue: Array<any>;
        sendxhr: any;
        xhr: any;
        socket: Socket;
        url: string;
        connected: boolean;
        constructor(socket: Socket);
        createTransport(url: string, method?: string): any;
        private requestFactory(url, method, multipart?);
        private getRequest(url, isconnect?);
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        send(data: any): void;
        onData(data?: any, header?: any): string;
        XmlHttpRequest(): any;
        onClose(): void;
        disconnect(): void;
        reconnect(): void;
        onSuccess(responseText: string, isconnect?: any): void;
        onError(): void;
    }
}
declare var typeMapping: {
    [s: string]: any;
}, registerMessageTypeMapping: {
    [s: string]: any;
}, HistoryMsgType: {
    [s: number]: any;
}, disconnectStatus: {
    [s: number]: any;
};
declare module RongIMLib {
    /**
     * 通道标识类
     */
    class Transportations {
        static _TransportType: string;
    }
    class PublicServiceMap {
        publicServiceList: Array<any>;
        constructor();
        get(publicServiceType: ConversationType, publicServiceId: string): PublicServiceProfile;
        add(publicServiceProfile: PublicServiceProfile): void;
        replace(publicServiceProfile: PublicServiceProfile): void;
        remove(conversationType: ConversationType, publicServiceId: string): void;
    }
    /**
     * 会话工具类。
     */
    class ConversationMap {
        conversationList: Array<Conversation>;
        constructor();
        get(conversavtionType: number, targetId: string): Conversation;
        add(conversation: Conversation): void;
        /**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
        replace(conversation: Conversation): void;
        remove(conversation: Conversation): void;
    }
    /**
     * 工具类
     */
    class MessageUtil {
        static schemeArrs: Array<any>;
        static sign: any;
        static supportLargeStorage(): boolean;
        /**
         *4680000 为localstorage最小容量5200000字节的90%，超过90%将删除之前过早的存储
         */
        static checkStorageSize(): boolean;
        static ArrayForm(typearray: any): Array<any>;
        static ArrayFormInput(typearray: any): Uint8Array;
        static indexOf(arr?: any, item?: any, from?: any): number;
        static isArray(obj: any): boolean;
        static forEach(arr: any, func: any): (arr: any, func: any) => void;
        static remove(array: any, func: any): void;
        static int64ToTimestamp(obj: any, isDate?: boolean): any;
        static messageParser(entity: any, onReceived?: any): any;
    }
    class MessageIdHandler {
        static messageId: number;
        static isXHR: boolean;
        static init(): void;
        static messageIdPlus(method: any): any;
        static clearMessageId(): void;
        static getMessageId(): number;
    }
    class CheckParam {
        static getInstance(): CheckParam;
        check(f: any, position: string, d?: any): void;
        getType(str: string): string;
    }
    class LimitableMap {
        map: any;
        keys: any;
        limit: number;
        constructor(limit?: number);
        set(key: string, value: any): void;
        get(key: string): number;
        remove(key: string): void;
    }
}
declare module RongIMLib {
    interface ConnectionStatusListener {
        onChanged(status: number): void;
    }
    interface OnReceiveMessageListener {
        onReceived(message: Message, left: number): void;
    }
    interface RealTimeLocationListener {
        onError(errorCode: RealTimeLocationErrorCode): void;
        onParticipantsJoin(userId: string): void;
        onParticipantsQuit(userId: string): void;
        onReceiveLocation(latitude: number, longitude: number, userId: string): void;
        onStatusChange(status: RealTimeLocationStatus): void;
    }
}
declare module RongIMLib {
    abstract class MessageContent {
        messageName: string;
        constructor(data?: any);
        static obtain(): MessageContent;
        abstract encode(): string;
    }
    abstract class NotificationMessage extends MessageContent {
    }
    abstract class StatusMessage extends MessageContent {
    }
    interface UserInfoAttachedMessage {
        user: UserInfo;
    }
    interface ExtraAttachedMessage {
        extra: string;
    }
    class ModelUtil {
        static modelClone(object: any): any;
        static modleCreate(fields: string[]): any;
    }
}
declare module RongIMLib {
    /**
     * 客服转换响应消息的类型名
     */
    class ChangeModeResponseMessage implements MessageContent {
        messageName: string;
        code: number;
        data: any;
        msg: string;
        constructor(message: any);
        static obtain(): ChangeModeResponseMessage;
        encode(): string;
    }
    /**
     * 客服转换消息的类型名
     * 此消息不计入未读消息数
     */
    class ChangeModeMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        constructor(message: any);
        static obtain(): ChangeModeMessage;
        encode(): string;
    }
    class HandShakeMessage implements MessageContent {
        messageName: string;
        constructor();
        static obtain(): HandShakeMessage;
        encode(): string;
    }
    class EvaluateMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        source: number;
        suggest: string;
        isRobotResolved: boolean;
        type: number;
        constructor(message: any);
        static obtain(): EvaluateMessage;
        encode(): string;
    }
    /**
     * 客服握手响应消息的类型名
     */
    class HandShakeResponseMessage implements MessageContent {
        messageName: string;
        msg: string;
        status: number;
        data: any;
        constructor(message: any);
        static obtain(): HandShakeResponseMessage;
        encode(): string;
    }
    class SuspendMessage implements MessageContent {
        messageName: string;
        uid: string;
        sid: string;
        pid: string;
        constructor(message: any);
        static obtain(): SuspendMessage;
        encode(): string;
    }
    class TerminateMessage implements MessageContent {
        messageName: string;
        code: number;
        msg: string;
        sid: string;
        constructor(message: any);
        static obtain(): TerminateMessage;
        encode(): string;
    }
}
declare module RongIMLib {
    class IsTypingStatusMessage implements StatusMessage {
        messageName: string;
        constructor(data: string);
        encode(): string;
        getMessage(): any;
    }
}
declare module RongIMLib {
    class InformationNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        message: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(message: string): InformationNotificationMessage;
        encode(): string;
    }
    class CommandMessage implements MessageContent, ExtraAttachedMessage {
        data: string;
        extra: string;
        name: string;
        messageName: string;
        constructor(message: any);
        static obtain(data: string): CommandMessage;
        encode(): string;
    }
    class ContactNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        static CONTACT_OPERATION_ACCEPT_RESPONSE: string;
        static CONTACT_OPERATION_REJECT_RESPONSE: string;
        static CONTACT_OPERATION_REQUEST: string;
        operation: string;
        targetUserId: string;
        sourceUserId: string;
        message: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(operation: string, sourceUserId: string, targetUserId: string, message: string): InformationNotificationMessage;
        encode(): string;
    }
    class ProfileNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        operation: string;
        data: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(operation: string, data: string): ProfileNotificationMessage;
        encode(): string;
    }
    class CommandNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        data: string;
        name: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(name: string, data: string): CommandNotificationMessage;
        encode(): string;
    }
    class DiscussionNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        extension: string;
        type: number;
        isHasReceived: boolean;
        operation: string;
        messageName: string;
        constructor(message: any);
        encode(): string;
    }
}
declare module RongIMLib {
    class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        content: string;
        messageName: string;
        constructor(message: any);
        static obtain(text: string): TextMessage;
        encode(): string;
    }
    class TypingStatusMessage implements MessageContent {
        typingContentType: string;
        data: string;
        messageName: string;
        constructor(message: any);
        static obtain(typingContentType: string, data: string): TypingStatusMessage;
        encode(): string;
    }
    class VoiceMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        content: string;
        duration: number;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(base64Content: string, duration: number): VoiceMessage;
        encode(): string;
    }
    class ImageMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        content: string;
        imageUri: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(content: string, imageUri: string): ImageMessage;
        encode(): string;
    }
    class ReadReceiptMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        messageUId: string;
        lastMessageSendTime: string;
        type: string
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(messageUId: string, lastMessageSendTime: string, type: string): ReadReceiptMessage;
        encode(): string;
    }
    class LocationMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        latiude: number;
        longitude: number;
        poi: string;
        content: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(latitude: number, longitude: number, poi: string, content: string): LocationMessage;
        encode(): string;
    }
    class RichContentMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        title: string;
        content: string;
        imageUri: string;
        extra: string;
        url: string;
        messageName: string;
        constructor(message: any);
        static obtain(title: string, content: string, imageUri: string, url: string): RichContentMessage;
        encode(): string;
    }
    class UnknownMessage implements MessageContent {
        message: UnknownMessage;
        messageName: string;
        constructor(message: any);
        encode(): string;
    }
    class PublicServiceCommandMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        menuItem: PublicServiceMenuItem;
        content: string;
        extra: string;
        messageName: string;
        constructor(message: any);
        static obtain(item: PublicServiceMenuItem): PublicServiceCommandMessage;
        encode(): string;
    }
    class PublicServiceMultiRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        user: UserInfo;
        richContentMessages: Array<RichContentMessage>;
        messageName: string;
        constructor(messages: Array<RichContentMessage>);
        encode(): any;
    }
    class PublicServiceRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        user: UserInfo;
        richContentMessage: RichContentMessage;
        messageName: string;
        constructor(message: RichContentMessage);
        encode(): any;
    }
}
declare module RongIMLib {
    class CustomServiceConfig {
        constructor(isBlack?: boolean, companyName?: string, companyUrl?: string);
    }
    class CustomServiceSession {
        constructor(uid?: string, cid?: string, pid?: string, isQuited?: boolean, type?: number, adminHelloWord?: string, adminOfflineWord?: string);
    }
    class Conversation {
        conversationTitle: string;
        conversationType: ConversationType;
        draft: string;
        isTop: boolean;
        latestMessage: any;
        latestMessageId: string;
        notificationStatus: ConversationNotificationStatus;
        objectName: string;
        receivedStatus: ReceivedStatus;
        receivedTime: number;
        senderUserId: string;
        senderUserName: string;
        sentStatus: SentStatus;
        sentTime: number;
        targetId: string;
        unreadMessageCount: number;
        senderPortraitUri: string;
        constructor(conversationTitle?: string, conversationType?: ConversationType, draft?: string, isTop?: boolean, latestMessage?: any, latestMessageId?: string, notificationStatus?: ConversationNotificationStatus, objectName?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, senderUserName?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, unreadMessageCount?: number, senderPortraitUri?: string);
        setTop(): void;
    }
    class Discussion {
        creatorId: string;
        id: string;
        memberIdList: string[];
        name: string;
        isOpen: boolean;
        constructor(creatorId?: string, id?: string, memberIdList?: string[], name?: string, isOpen?: boolean);
    }
    class Group {
        id: string;
        name: string;
        portraitUri: string;
        constructor(id: string, name: string, portraitUri: string);
    }
    class Message {
        content: MessageContent;
        conversationType: ConversationType;
        extra: string;
        objectName: string;
        messageDirection: MessageDirection;
        messageId: string;
        receivedStatus: ReceivedStatus;
        receivedTime: number;
        senderUserId: string;
        sentStatus: SentStatus;
        sentTime: number;
        targetId: string;
        messageType: string;
        messageUId: string;
        hasReceivedByOtherClient: boolean;
        isLocalMessage: boolean;
        constructor(content?: MessageContent, conversationType?: ConversationType, extra?: string, objectName?: string, messageDirection?: MessageDirection, messageId?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, messageType?: string, messageUId?: string, hasReceivedByOtherClient?: boolean, isLocalMessage?: boolean);
    }
    class MessageTag {
        isCounted: boolean;
        isPersited: boolean;
        constructor(isCounted: boolean, isPersited: boolean);
        getMessageTag(): number;
    }
    class PublicServiceMenuItem {
        id: string;
        name: string;
        type: ConversationType;
        sunMenuItems: Array<PublicServiceMenuItem>;
        url: string;
        constructor(id?: string, name?: string, type?: ConversationType, sunMenuItems?: Array<PublicServiceMenuItem>, url?: string);
    }
    class PublicServiceProfile {
        conversationType: ConversationType;
        introduction: string;
        menu: Array<PublicServiceMenuItem>;
        name: string;
        portraitUri: string;
        publicServiceId: string;
        hasFollowed: boolean;
        isGlobal: boolean;
        constructor(conversationType?: ConversationType, introduction?: string, menu?: Array<PublicServiceMenuItem>, name?: string, portraitUri?: string, publicServiceId?: string, hasFollowed?: boolean, isGlobal?: boolean);
    }
    class UserInfo {
        userId: string;
        name: string;
        portraitUri: string;
        constructor(userId: string, name: string, portraitUri: string);
    }
}
declare module RongIMLib {
    class ServerDataProvider implements DataAccessProvider {
        database: DBUtil;
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, messageIds: string[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string): Conversation;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        getTotalUnreadCount(callback: ResultCallback<number>): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
    }
}
declare module RongIMLib {
    class DBUtil {
        private db;
        userId: string;
        init(userId: string): boolean;
        execSearchByParams(sql: string, values: string[], callback: any): void;
        execSearch(sql: string, callback: any): void;
        execUpdateByParams(sql: string, values: any[]): void;
        execUpdate(sql: string): void;
    }
}
declare module RongIMLib {
    class WebSQLDataProvider implements DataAccessProvider {
        database: DBUtil;
        private updateConversation(conversation, callback);
        addConversation(conver: Conversation, callback: ResultCallback<boolean>): void;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, messageIds: string[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string): Conversation;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        getTotalUnreadCount(callback: ResultCallback<number>): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
    }
}
declare module RongIMLib {
    interface DataAccessProvider {
        database: DBUtil;
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;
        removeMessage(conversationType: ConversationType, targetId: string, messageId: string[], callback: ResultCallback<boolean>): void;
        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;
        updateMessage(message: Message, callback?: ResultCallback<Message>): void;
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;
        getConversation(conversationType: ConversationType, targetId: string): Conversation;
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;
        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;
        getTotalUnreadCount(callback: ResultCallback<number>): void;
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;
        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;
        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;
    }
}
declare module RongIMLib {
    class CookieProvider implements StorageProvider {
        _host: string;
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        removeItem(composedKey: string): void;
        getItemKey(regStr: string): any;
        clearItem(): void;
        onOutOfQuota(): number;
    }
}
declare module RongIMLib {
    class LocalStorageProvider implements StorageProvider {
        static getInstance(): LocalStorageProvider;
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        removeItem(composedKey: string): void;
        clearItem(): void;
        onOutOfQuota(): number;
    }
}
declare module RongIMLib {
    interface StorageProvider {
        setItem(composedKey: string, object: any): void;
        getItem(composedKey: string): string;
        removeItem(composedKey: string): void;
        clearItem(): void;
        onOutOfQuota(): number;
    }
    interface ComposeKeyFunc {
        (object: any): string;
    }
}
declare module RongIMLib {
    class FeatureDectector {
        script: any;
        head: any;
        constructor();
    }
}
declare module RongIMLib {
    class FeaturePatcher {
        patchAll(): void;
        patchForEach(): void;
        patchJSON(): void;
    }
}
declare module RongIMLib {
}
