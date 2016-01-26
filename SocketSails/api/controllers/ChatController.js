/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    suscribirseOPublicar: function (req, res) {

        console.log('Entro a la función del Controlador Chat');
        //guardamos los parámetros en una variable
        var parametros = req.params.all();
        //Vamos a hacer una comparación, si es que la petición es con webssockets y es un método post creamos y publicamos el Chat
        if (req.isSocket && req.method === 'POST') {
          console.log('Es un websocket y usa un método POST', parametros.nombre);


          //Aqui estamos registrando el chat en la Base de Datos
          Chat.create({
            nombre: parametros.nombre
          }).exec(function (err, nuevoChatCreado) {
            //Si hay error imprimimos el error
            if (err) console.log(err);
            console.log('se creo el mensaje del chat: ', nuevoChatCreado);

            //Si no hay error publicamos el chat por medio de los websockets y podemos enviar nuevos parametros como el "fechaDelServidor"
            Chat.publishCreate({
              nombre: nuevoChatCreado.nombre,
              id: nuevoChatCreado.id,
              fechaDelServido: new Date()
            });


          });
          //Aqui definimos si la peticion es con websocket entonces lo suscribimos
        } else if (req.isSocket) {

          //Suscribimos al usuario a Chat
          Chat.watch(req.socket);
          console.log('Se ha suscrito con el id de socket: ' + req.socket.id);
          return res.ok('Suscrito con el id: '+req.socket.id);

        } else {

          //Si no se suscribe ni se crea un chat, entonces desplegar en consola que es un bad request.
          console.log('Bad Request')


    }




  }


};
