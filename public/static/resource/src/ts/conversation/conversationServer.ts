/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="../../lib/RongIMLib.d.ts"/>
module RongWebIMWidget.conversation {

    class CustomerService {
        type: string;
        currentType: number;
        companyName: string;
        robotName: string;
        robotIcon: string;
        robotWelcome: string;
        humanWelcome: string;
        noOneOnlineTip: string;
        isblack: string;
        connected: boolean;
        human: {
            name: string,
            headimgurl: string
        } = <any>{}
    }

    export interface IConversationService {

        current: RongWebIMWidget.Conversation
        _customService: CustomerService
        _cacheHistory: any
        _uploadToken: string

        _getHistoryMessages(targetType: number, targetId: string, number: number): angular.IPromise<any>
        _addHistoryMessages(msg: RongWebIMWidget.Message): void

        changeConversation(conversation: RongWebIMWidget.Conversation): void
        handleMessage(message: RongWebIMWidget.Message): void
        closeConversation(): ng.IPromise<any>
        addCustomServiceInfo(msg: RongWebIMWidget.Message): void

        _handleConnectSuccess(): void// 获取上传 token ，并初始化上传控件
    }

    class conversationServer implements IConversationService {

        static $inject: string[] = ["$q", "ProviderData"];

        constructor(private $q: ng.IQService,
            private providerdata: RongWebIMWidget.ProviderData) {

        }

        current: RongWebIMWidget.Conversation = new RongWebIMWidget.Conversation
        _cacheHistory: Object = {}
        _customService: CustomerService = <any>new CustomerService();
        _uploadToken: string

        unshiftHistoryMessages(id: string, type: number, item: any) {
            var key = type + "_" + id;
            var arr = this._cacheHistory[key] = this._cacheHistory[key] || [];
            if (arr[0] && arr[0].sentTime && arr[0].panelType != RongWebIMWidget.PanelType.Time && item.sentTime) {
                if (!RongWebIMWidget.Helper.timeCompare(arr[0].sentTime, item.sentTime)) {
                    arr.unshift(new RongWebIMWidget.TimePanl(arr[0].sentTime));
                }
            }
            arr.unshift(item);
        }

        _getHistoryMessages(targetType: number,
            targetId: string,
            number: number,
            reset?: boolean) {

            var defer = this.$q.defer();
            var _this = this;

            RongIMLib.RongIMClient.getInstance().getHistoryMessages(targetType, targetId, reset ? 0 : null, number, {
                onSuccess: function(data, has) {
                    var msglen = data.length;
                    while (msglen--) {
                        var msg = RongWebIMWidget.Message.convert(data[msglen]);

                        switch (msg.messageType) {
                            case RongWebIMWidget.MessageType.TextMessage:
                            case RongWebIMWidget.MessageType.ImageMessage:
                            case RongWebIMWidget.MessageType.VoiceMessage:
                            case RongWebIMWidget.MessageType.RichContentMessage:
                            case RongWebIMWidget.MessageType.LocationMessage:
                            case RongWebIMWidget.MessageType.InformationNotificationMessage:
                                _this.unshiftHistoryMessages(targetId, targetType, msg);
                                _this.addCustomServiceInfo(msg);
                                if (msg.content && _this.providerdata.getUserInfo) {
                                    (function(msg) {
                                        _this.providerdata.getUserInfo(msg.senderUserId, {
                                            onSuccess: function(obj) {
                                                msg.content.userInfo = new RongWebIMWidget.UserInfo(obj.userId, obj.name, obj.portraitUri);
                                            }
                                        })
                                    })(msg)
                                }
                                break;
                            case RongWebIMWidget.MessageType.UnknownMessage:
                                break;
                            default:
                                break;
                        }


                    }

                    defer.resolve({ data: data, has: has });
                },
                onError: function(error) {
                    defer.reject(error);
                }
            })

            return defer.promise;
        }

        _addHistoryMessages(item: RongWebIMWidget.Message) {
            var key = item.conversationType + "_" + item.targetId;
            var arr = this._cacheHistory[key];
            if (arr.length == 0) {
                arr.push(new RongWebIMWidget.GetHistoryPanel());
            }

            if (arr[arr.length - 1]
                && arr[arr.length - 1].panelType != RongWebIMWidget.PanelType.Time
                && arr[arr.length - 1].sentTime
                && item.sentTime) {
                if (!RongWebIMWidget.Helper.timeCompare(arr[arr.length - 1].sentTime,
                    item.sentTime)) {
                    arr.push(new RongWebIMWidget.TimePanl(item.sentTime));
                }
            }
            arr.push(item);
        }
        updateUploadToken() {
            var _this = this;
            RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function(data) {
                    _this._uploadToken = data.token;
                }, onError: function() {

                }
            })
        }

        addCustomServiceInfo(msg: RongWebIMWidget.Message) {
            if (!msg.content || (msg.content.userInfo && msg.content.userInfo.name)) {
                return;
            }
            if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE) {
                if (this._customService.currentType == 1) {
                    msg.content.userInfo = {
                        name: this._customService.human.name || "客服人员",
                        portraitUri: this._customService.human.headimgurl || this._customService.robotIcon,
                    }
                } else {
                    msg.content.userInfo = {
                        name: this._customService.robotName,
                        portraitUri: this._customService.robotIcon,
                    }
                }
            } else if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                msg.content.userInfo = {
                    name: "我",
                    portraitUri: this.providerdata.currentUserInfo.portraitUri
                }
            }
            return msg;
        }



        changeConversation: (conversation: RongWebIMWidget.Conversation) => void
        handleMessage: (message: RongWebIMWidget.Message) => void
        closeConversation: () => ng.IPromise<any>

        _handleConnectSuccess: () => void
    }

    angular.module("RongWebIMWidget.conversation")
        .service("ConversationServer", conversationServer)
}
