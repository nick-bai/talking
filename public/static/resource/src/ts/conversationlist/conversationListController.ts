module RongWebIMWidget.conversationlist {
    class conversationListController {
        static $inject: string[] = [
            "$scope",
            "ConversationListServer",
            "WebIMWidget"
        ]

        constructor(
            private $scope: any,
            private conversationListServer: RongWebIMWidget.conversationlist.IConversationListServer,
            private WebIMWidget: RongWebIMWidget.WebIMWidget
        ) {
            $scope.minbtn = function() {
                WebIMWidget.display = false;
            }
            $scope.conversationListServer = conversationListServer;
        }
    }

    angular.module("RongWebIMWidget.conversationlist")
        .controller("conversationListController", conversationListController)
}
