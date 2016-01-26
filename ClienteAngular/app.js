//Definimos la URL de Sails para trabajar cuando no este dentro del servidor Sails la aplicacion de Angular
io.sails.url = "http://localhost:1337";

//Creamos una nueva aplicacion llamada Chat
var app = angular.module('chat', []);

//Definimos el Controlador 'main' con las dependencias $scope y $http
app.controller('main', ['$scope', '$http', function ($scope, $http) {

  //Constructor
  //Variable nuevo chat para enviar un nuevo chat con websocket o con http
  $scope.nuevoChatHttp;
  $scope.nuevoChatWebSocket;

  //Nos suscribimos gracias al 'Blueprint' de Sailsjs con el modelo Chat
  //Ademas de esto Sails nos trae todos los datos del servidor
  //Aqui populamos la variable 'chatsWs'
  io.socket.get('http://localhost:1337/Chat',
    function (resData, jwres) {
      console.log('Se suscribio con blueprint de Sailsjs')
      console.log(resData);
      $scope.chatsWs = resData;
      //$digest() es necesario para que se actualice en la vista
      $scope.$digest();
    });

  //Nos suscribimos con el metodo suscribirseOPublicar dentro del controlador de Chat en Sailsjs que nosotros creamos
  io.socket.get('http://localhost:1337/Chat/suscribirseOPublicar',
    function (resData, jwres) {
      console.log('Se suscribio con nuestro metodo suscribirseOPublicar...');
      console.log(jwres);
      console.log('No hay datos porq es nuestro metodo...');
      console.log(resData);
    });

  //Llamamos a los Chats con HTTP
  //Aqui populamos la variable 'chatsHttp'
  $http({
    method: 'GET',
    url: 'http://localhost:1337/Chat'
  }).then(
    function (resp) {
      console.log('Chats traidos con un GET HTTTP')
      console.log(resp);
      $scope.chatsHttp = resp.data;

    },
    function (err) {
      console.log(err);
    });
  //Creamos un nuevo chat mediante HTTP
  $scope.llamarConHttpPost = function () {

    console.log('Entro a llamada con HTTp');

    $http({
      method: 'POST',
      url: 'http://localhost:1337/Chat',
      data: {
        nombre: $scope.nuevoChatHttp
      }
    }).then(
      function (resp) {
        console.log(resp);

      },
      function (err) {
        console.log(err);

      });

    $scope.nuevoChatHttp = "";

  }
  //Creamos un nuevo chat mediante WebSockets
  $scope.llamarConSocketPost = function () {
    console.log('Entro a llamada con WebSocket');
    io.socket.post(
      'http://localhost:1337/Chat/suscribirseOPublicar', {
        nombre: $scope.nuevoChatWebSocket
      });
    $scope.nuevoChatWebSocket = "";


  }

  //Escuchamos que el servidor nos responda 'Chat' (nombre de modelo en sails) 
  //para saber si se actualizo, borro, creo o modifico un registro
  io.socket.on('chat', function (objQueLLegaCuandoCreaUnChat) {
    console.log('Respondio del Servidor');
    console.log(objQueLLegaCuandoCreaUnChat);
    console.log('Verbo');
    console.log(objQueLLegaCuandoCreaUnChat.verb);
    
    //Aqui esta implementado solamente cuando el servidor nos responde que creamos un registro
    if (objQueLLegaCuandoCreaUnChat.verb === 'created') {
      //Agregamos tanto al arreglo 'chatsHttp' como al arreglo 'chatsWs'
      $scope.chatsHttp.push(objQueLLegaCuandoCreaUnChat.data);
      $scope.chatsWs.push(objQueLLegaCuandoCreaUnChat.data);
      $scope.$digest();
    }
    if (objQueLLegaCuandoCreaUnChat.verb === 'destroyed') {
      //Escribir el codigo para cuando se borre un registro, buscarlo en nuestro arreglo local
      //y eliminarlo del arreglo
      $scope.$digest();
    }
    if (objQueLLegaCuandoCreaUnChat.verb === 'updated') {
      //Escribir el codigo para cuando se actualice un registro, buscarlo en nuestro arreglo local
      //y actualizarlo
      $scope.$digest();
    }
    
    
    
  })


}]);