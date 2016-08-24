module RongWebIMWidget.conversationlist {

    export interface IConversationListServer {
        _conversationList: RongWebIMWidget.Conversation[]
        _onlineStatus: any[]

        setHiddenConversations(hiddenConversations: any[]): void
        updateConversations(): angular.IPromise<any>
        startRefreshOnlineStatus(): void
        stopRefreshOnlineStatus(): void
        _getConversation(type: number, id: string): RongWebIMWidget.Conversation
    }

    class ConversationListServer implements IConversationListServer {

        static $inject: string[] = ["$q",
            "ProviderData",
            "WidgetConfig",
            "RongIMSDKServer",
            "ConversationServer"];

        constructor(private $q: ng.IQService,
            private providerdata: RongWebIMWidget.ProviderData,
            private widgetConfig: RongWebIMWidget.WidgetConfig,
            private RongIMSDKServer: RongWebIMWidget.RongIMSDKServer,
            private conversationServer: RongWebIMWidget.conversation.IConversationService
        ) {

        }


        _conversationList: RongWebIMWidget.Conversation[] = [];
        _onlineStatus: any[] = [];
        __intervale: any

        hiddenConversations: any[] = []
        _hiddenConversationObject: any = {}

        setHiddenConversations(list: any[]) {
            if (angular.isArray(list)) {
                for (var i = 0, length = list.length; i < length; i++) {
                    this._hiddenConversationObject[list[i].type + "_" + list[i].id] = true;
                }
            }
        }

        updateConversations() {
            var defer = this.$q.defer();
            var _this = this;

            RongIMLib.RongIMClient.getInstance().getConversationList({
                onSuccess: function(data) {
                    var totalUnreadCount = 0;

                    _this._conversationList.splice(0, _this._conversationList.length);

                    for (var i = 0, len = data.length; i < len; i++) {
                        var con = RongWebIMWidget.Conversation.onvert(data[i]);

                        if (_this._hiddenConversationObject[con.targetType + "_" + con.targetId]) {
                            continue;
                        }

                        switch (con.targetType) {
                            case RongIMLib.ConversationType.PRIVATE:
                                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                                    (function(a, b) {
                                        _this.providerdata.getUserInfo(a.targetId, {
                                            onSuccess: function(data) {
                                                a.title = data.name;
                                                a.portraitUri = data.portraitUri;
                                                b.conversationTitle = data.name;
                                                b.portraitUri = data.portraitUri;
                                            }
                                        })
                                    } (con, data[i]));
                                }
                                break;
                            case RongIMLib.ConversationType.GROUP:
                                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getGroupInfo) == "function") {
                                    (function(a, b) {
                                        _this.providerdata.getGroupInfo(a.targetId, {
                                            onSuccess: function(data) {
                                                a.title = data.name;
                                                a.portraitUri = data.portraitUri;
                                                b.conversationTitle = data.name;
                                                b.portraitUri = data.portraitUri;
                                            }
                                        })
                                    } (con, data[i]))
                                }
                                break;
                            case RongIMLib.ConversationType.CHATROOM:
                                con.title = "聊天室：" + con.targetId;
                                break;
                        }
                        totalUnreadCount += Number(con.unreadMessageCount) || 0
                        _this._conversationList.push(con);
                    }
                    _this._onlineStatus.forEach(function(item) {
                        var conv = _this._getConversation(RongWebIMWidget.EnumConversationType.PRIVATE, item.id);
                        conv && (conv.onLine = item.status);
                    });

                    if (_this.widgetConfig.displayConversationList) {
                        _this.providerdata.totalUnreadCount = totalUnreadCount;
                        defer.resolve();
                    } else {
                        var cu = _this.conversationServer.current;
                        cu && cu.targetId && _this.RongIMSDKServer.getConversation(cu.targetType, cu.targetId).then(function(conv) {
                            if (conv && conv.unreadMessageCount) {
                                _this.providerdata.totalUnreadCount = conv.unreadMessageCount || 0;
                                defer.resolve();
                            } else {
                                _this.providerdata.totalUnreadCount = 0;
                                defer.resolve();
                            }
                        })
                    }

                },
                onError: function(error) {
                    defer.reject(error);
                }
            }, null);
            return defer.promise;
        }


        _getConversation(type: number, id: string) {

            for (var i = 0, len = this._conversationList.length; i < len; i++) {
                if (this._conversationList[i].targetType == type && this._conversationList[i].targetId == id) {
                    return this._conversationList[i];
                }
            }
            return null;
        }

        startRefreshOnlineStatus() {
            var _this = this;
            if (_this.widgetConfig.displayConversationList && _this.providerdata.getOnlineStatus) {
                _this._getOnlineStatus();
                _this.__intervale && clearInterval(this.__intervale);
                _this.__intervale = setInterval(function() {
                    _this._getOnlineStatus();
                }, 30 * 1000);
            }
        }
        _getOnlineStatus() {
            var _this = this;
            var arr = _this._conversationList.map(function(item) { return item.targetId });
            _this.providerdata.getOnlineStatus(arr, {
                onSuccess: function(data) {
                    _this._onlineStatus = data;
                    _this.updateConversations();
                }
            })
        }
        stopRefreshOnlineStatus() {
            clearInterval(this.__intervale);
            this.__intervale = null;
        }

    }

    angular.module("RongWebIMWidget.conversationlist")
        .service("ConversationListServer", ConversationListServer)
}
