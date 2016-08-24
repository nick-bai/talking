var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.controller("main", ["$scope", "WebIMWidget", function($scope,
  WebIMWidget) {

  $scope.show = function() {
    WebIMWidget.show();
  }

  $scope.hidden = function() {
    WebIMWidget.hidden();
  }

  $scope.server = WebIMWidget;
  $scope.targetType=1;

  $scope.setconversation=function(){
    WebIMWidget.setConversation(Number($scope.targetType), $scope.targetId, "自定义:"+$scope.targetId);
  }

    WebIMWidget.init({
      appkey: "3argexb6r934e",
      token: "tt8zu08SKMJxrv4Y0ymvoJUnU/cREmEFuMhOJuGv5bPlXUSQuAsZcVjEEwGrOODdblCL+ZfLmCJg2Mh5WIasRw==",
      voiceUrl:'../widget/images/sms-received.mp3',
      // reminder:"qwer",
      style:{
          right:10
      },
      onSuccess:function(id){
          console.log(id);
          WebIMWidget.setConversation(1, "cc", "呵呵");
      },
      onError:function(error){
        console.log("error:"+error);
      }
    });

    WebIMWidget.setUserInfoProvider(function(targetId,obj){
        obj.onSuccess({name:"陌："+targetId});
    });


    WebIMWidget.onClose=function(){
      console.log("已关闭");
    }

}]);
