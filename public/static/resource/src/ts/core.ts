module RongWebIMWidget {

    class ProductInfo {
        title: string
        url: string
        content: string
        imageUrl: string
    }

    interface IWebIMWidget {

        init(config: any): void

        show(): void
        onShow(): void
        hidden(): void
        display: boolean
        fullScreen: boolean
        connected: boolean
        totalUnreadCount: number

        setConversation(targetType: number, targetId: string, title: string): void

        onReceivedMessage(msg: RongWebIMWidget.Message): void

        onSentMessage(msg: RongWebIMWidget.Message): void

        onClose(data: any): void

        onCloseBefore(obj: any): void

        onConnectStatusChange(status: number): void

        getCurrentConversation(): RongWebIMWidget.Conversation

        setUserInfoProvider(fun: Function)
        setGroupInfoProvider(fun: Function)
        setOnlineStatusProvider(fun: Function)

        setProductInfo()

        /**
         * 静态属性
         */
        EnumConversationListPosition: any
        EnumConversationType: any
    }

    var eleConversationListWidth = 195,
        eleminbtnHeight = 50,
        eleminbtnWidth = 195,
        spacing = 3;

    export class WebIMWidget {

        static $inject: string[] = ["$q",
            "ConversationServer",
            "ConversationListServer",
            "ProviderData",
            "WidgetConfig",
            "RongIMSDKServer",
            "$log"];

        display: boolean = false;
        connected: boolean = false;

        constructor(private $q: ng.IQService,
            private conversationServer: RongWebIMWidget.conversation.IConversationService,
            private conversationListServer: RongWebIMWidget.conversationlist.IConversationListServer,
            private providerdata: RongWebIMWidget.ProviderData,
            private widgetConfig: RongWebIMWidget.WidgetConfig,
            private RongIMSDKServer: RongWebIMWidget.RongIMSDKServer,
            private $log: ng.ILogService) {

        }

        init(config: any) {
            var _this = this;

            config.reminder && (_this.widgetConfig.reminder = config.reminder)

            if (!window.RongIMLib || !window.RongIMLib.RongIMClient) {
                _this.widgetConfig._config = config;
                return;
            }


            var defaultStyle = _this.widgetConfig.style;
            angular.extend(_this.widgetConfig, config);
            angular.extend(defaultStyle, config.style);

            if (config.desktopNotification) {
                RongWebIMWidget.NotificationHelper.requestPermission();
            }


            var eleplaysound = document.getElementById("rongcloud-playsound");
            if (eleplaysound && typeof _this.widgetConfig.voiceUrl === "string") {
                eleplaysound["src"] = _this.widgetConfig.voiceUrl;
                _this.widgetConfig.voiceNotification = true;
            } else {
                _this.widgetConfig.voiceNotification = false;
            }

            var eleconversation = document.getElementById("rong-conversation");
            var eleconversationlist = document.getElementById("rong-conversation-list");

            var eleminbtn = document.getElementById("rong-widget-minbtn");
            if (_this.widgetConfig.__isKefu) {
                eleminbtn = document.getElementById("rong-widget-minbtn-kefu");
            }

            if (defaultStyle) {

                eleconversation.style["height"] = defaultStyle.height + "px";
                eleconversation.style["width"] = defaultStyle.width + "px";
                eleconversationlist.style["height"] = defaultStyle.height + "px";

                if (defaultStyle.positionFixed) {
                    eleconversationlist.style['position'] = "fixed";
                    eleminbtn.style['position'] = "fixed";
                    eleconversation.style['position'] = "fixed";
                } else {
                    eleconversationlist.style['position'] = "absolute";
                    eleminbtn.style['position'] = "absolute";
                    eleconversation.style['position'] = "absolute";
                }

                if (_this.widgetConfig.displayConversationList) {

                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "inline-block";

                    if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.left) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + "px";
                            eleminbtn.style["left"] = defaultStyle.left + "px";
                            eleconversation.style["left"] = defaultStyle.left + eleConversationListWidth + spacing + "px";
                        }

                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleconversation.style["right"] = defaultStyle.right + "px";
                        }


                    } else if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.right) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleconversation.style["left"] = defaultStyle.left + "px";
                        }

                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + "px";
                            eleminbtn.style["right"] = defaultStyle.right + "px";
                            eleconversation.style["right"] = defaultStyle.right + eleConversationListWidth + spacing + "px";
                        }
                    } else {
                        throw new Error("config conversationListPosition value is invalid")
                    }

                    if (!isNaN(defaultStyle["top"])) {
                        eleconversationlist.style["top"] = defaultStyle.top + "px";
                        eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                        eleconversation.style["top"] = defaultStyle.top + "px";
                    }

                    if (!isNaN(defaultStyle["bottom"])) {
                        eleconversationlist.style["bottom"] = defaultStyle.bottom + "px";
                        eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                        eleconversation.style["bottom"] = defaultStyle.bottom + "px";
                    }
                } else {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "none";

                    eleconversation.style["left"] = defaultStyle["left"] + "px";
                    eleconversation.style["right"] = defaultStyle["right"] + "px";
                    eleconversation.style["top"] = defaultStyle["top"] + "px";
                    eleconversation.style["bottom"] = defaultStyle["bottom"] + "px";

                    eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                    eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                    eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                    eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                }
            }
            if (_this.widgetConfig.displayMinButton == false) {
                eleminbtn.style["display"] = "none";
            }
            _this.conversationListServer.setHiddenConversations(_this.widgetConfig.hiddenConversations);

            _this.RongIMSDKServer.init(_this.widgetConfig.appkey);

            _this.RongIMSDKServer.registerMessage();

            _this.RongIMSDKServer.connect(_this.widgetConfig.token).then(function(userId) {
                _this.conversationListServer.updateConversations();
                _this.conversationListServer.startRefreshOnlineStatus();
                _this.conversationServer._handleConnectSuccess && _this.conversationServer._handleConnectSuccess();

                if (RongWebIMWidget.Helper.checkType(_this.widgetConfig.onSuccess) == "function") {
                    _this.widgetConfig.onSuccess(userId);
                }
                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                    _this.providerdata.getUserInfo(userId, {
                        onSuccess: function(data) {
                            _this.providerdata.currentUserInfo =
                                new RongWebIMWidget.UserInfo(data.userId,
                                    data.name,
                                    data.portraitUri
                                )
                        }
                    });
                }

                //_this.conversationServer._onConnectSuccess();
            }, function(err) {
                if (err.tokenError) {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: 0, info: "token 无效" });
                    }
                } else {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: err.errorCode });
                    }
                }
            })

            _this.RongIMSDKServer.setConnectionStatusListener({
                onChanged: function(status) {
                    _this.providerdata.connectionState = false;
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            _this.$log.debug('链接成功');
                            _this.providerdata.connectionState = true;
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            _this.$log.debug('正在链接');
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            _this.$log.debug('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            _this.$log.debug("网络不可用");
                            break;
                        default:
                            _this.$log.debug(status);
                    }

                }
            });

            _this.RongIMSDKServer.setOnReceiveMessageListener({
                onReceived: function(data) {
                    _this.$log.debug(data);
                    var msg = RongWebIMWidget.Message.convert(data);

                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function" && msg.content) {
                        _this.providerdata.getUserInfo(msg.senderUserId, {
                            onSuccess: function(data) {
                                if (data) {
                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                                }
                            }
                        })
                    }

                    switch (data.messageType) {
                        case RongWebIMWidget.MessageType.VoiceMessage:
                            msg.content.isUnReade = true;
                        case RongWebIMWidget.MessageType.TextMessage:
                        case RongWebIMWidget.MessageType.LocationMessage:
                        case RongWebIMWidget.MessageType.ImageMessage:
                        case RongWebIMWidget.MessageType.RichContentMessage:
                            _this.addMessageAndOperation(msg);
                            var voiceBase =
                                _this.providerdata.voiceSound == true
                                && eleplaysound
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.voiceNotification;
                            var currentConvversationBase =
                                _this.conversationServer.current
                                && _this.conversationServer.current.targetType == msg.conversationType
                                && _this.conversationServer.current.targetId == msg.targetId;
                            var notificationBase =
                                (document.hidden || !_this.display)
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.desktopNotification;
                            if ((_this.widgetConfig.displayConversationList && voiceBase) || (!_this.widgetConfig.displayConversationList && voiceBase && currentConvversationBase)) {
                                eleplaysound["play"]();
                            }
                            if ((notificationBase && _this.widgetConfig.displayConversationList) || (!_this.widgetConfig.displayConversationList && notificationBase && currentConvversationBase)) {
                                RongWebIMWidget.NotificationHelper.showNotification({
                                    title: msg.content.userInfo.name,
                                    icon: "",
                                    body: RongWebIMWidget.Message.messageToNotification(data), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            break;
                        case RongWebIMWidget.MessageType.ContactNotificationMessage:
                            //好友通知自行处理
                            break;
                        case RongWebIMWidget.MessageType.InformationNotificationMessage:
                            _this.addMessageAndOperation(msg);
                            break;
                        case RongWebIMWidget.MessageType.UnknownMessage:
                            //未知消息自行处理
                            break;
                        case RongWebIMWidget.MessageType.ReadReceiptMessage:
                            if (data.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId)
                            }
                            break;
                        default:
                            //未捕获的消息类型
                            break;
                    }

                    if (_this.onReceivedMessage) {
                        _this.onReceivedMessage(data);
                    }
                    _this.conversationServer.handleMessage(msg);

                    if (!document.hidden && _this.display
                        && _this.conversationServer.current
                        && _this.conversationServer.current.targetType == msg.conversationType
                        && _this.conversationServer.current.targetId == msg.targetId
                        && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                        && data.messageType != RongWebIMWidget.MessageType.ReadReceiptMessage) {
                        _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                        _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                    }
                    _this.conversationListServer.updateConversations().then(function() { });
                }
            });

            window.onfocus = function() {
                if (_this.conversationServer.current && _this.conversationServer.current.targetId && _this.display) {
                    _this.RongIMSDKServer.getConversation(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId).then(function(conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                            _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                            _this.conversationListServer.updateConversations().then(function() { });
                        }
                    })
                }
            }
        }

        addMessageAndOperation(msg: RongWebIMWidget.Message) {
            if (msg.conversationType === RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && !this.conversationServer._customService.connected) {
                //客服没有连接直接返回不追加显示消息
                return;
            }

            var key = msg.conversationType + "_" + msg.targetId;
            var hislist = this.conversationServer._cacheHistory[key] = this.conversationServer._cacheHistory[key] || []
            if (hislist.length == 0) {
                hislist.push(new RongWebIMWidget.GetHistoryPanel());
                hislist.push(new RongWebIMWidget.TimePanl(msg.sentTime));
            }
            this.conversationServer._addHistoryMessages(msg);
        }

        setConversation(targetType: number, targetId: string, title: string) {
            this.conversationServer.changeConversation(new RongWebIMWidget.Conversation(targetType, targetId, title))
        }

        setUserInfoProvider(fun) {
            this.providerdata.getUserInfo = fun;
        }

        setGroupInfoProvider(fun) {
            this.providerdata.getGroupInfo = fun;
        }

        setOnlineStatusProvider(fun) {
            this.providerdata.getOnlineStatus = fun;
        }

        setProductInfo(obj: ProductInfo) {
            if (this.conversationServer._customService.connected) {
                this.RongIMSDKServer.sendProductInfo(this.conversationServer.current.targetId, obj)
            } else {
                this.providerdata._productInfo = obj;
            }
        }

        show() {
            this.display = true;
        }

        hidden() {
            this.display = false;
        }

        getCurrentConversation() {
            return this.conversationServer.current;
        }

        fullScreen: boolean
        onReceivedMessage: (msg: any) => void
        onCloseBefore: (obj: any) => void
        onClose: (conversation: any) => void
        onShow: () => void

        EnumConversationType: any = RongWebIMWidget.EnumConversationType;
        EnumConversationListPosition: any = RongWebIMWidget.EnumConversationListPosition
    }

    angular.module("RongWebIMWidget")
        .service("WebIMWidget", WebIMWidget)

}
