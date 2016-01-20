io.sails.url = "http://localhost:1337";

var app = angular.module('chat', []);

app.controller('main', ['$scope', '$http', function ($scope, $http) {

  $scope.variable;
  
  io.socket.get('http://localhost:1337/Chat/conversacion');
  
  $http({
    method: 'GET',
    url: 'http://localhost:1337/Chat'
  }).then(
    function (resp) {
      console.log(resp);
      $scope.chat = resp.data;

    },
    function (err) {
      console.log(err);

    });
  
  
  io.socket.on('chat',function(objQueLLegaCuandoCreaUnChat){
    console.log('Escupio chat el servidor');
    console.log(objQueLLegaCuandoCreaUnChat);
    
    if(objQueLLegaCuandoCreaUnChat.verb === 'created'){
      $scope.chat.push(objQueLLegaCuandoCreaUnChat.data);
      $scope.$digest();
    }
    
  })

  //  io.socket.get('http://localhost:1337/Chat/conversacion');


  //  io.socket.request({
  //    method: 'get',
  //    url: 'http://localhost:1337/Chat/suscribirse'
  //  })

  //  $http({
  //    method: 'GET',
  //    url: 'http://localhost:1337/Chat/suscribirse'
  //  }).then(
  //    function (resp) {
  //      console.log(resp);
  //
  //    },
  //    function (err) {
  //      console.log(err);
  //
  //    });





  $scope.llamar = function () {
    console.log('penes');
    io.socket.post(
      'http://localhost:1337/Chat/conversacion', {
        nombre: $scope.variable
      });
    $scope.variable = "";

    //    
    //    $http({
    //      method: 'POST',
    //      url: 'http://localhost:1337/Chat/conversacion',
    //      data: {
    //        nombre: $scope.variable
    //      }
    //    }).then(
    //      function (resp) {
    //        console.log(resp);
    //
    //      },
    //      function (err) {
    //        console.log(err);
    //
    //      });

  }

}]);