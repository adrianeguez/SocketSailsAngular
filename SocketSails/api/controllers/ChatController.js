/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  suscribirse:function(req, res){

    console.log(req.socket);


  },
  conversacion: function (req, res) {

    console.log('entro arrechisimo');

    var parametros = req.params.all();
    if (req.isSocket && req.method === 'POST') {
      console.log('valens verga bien', parametros.nombre);
      Chat.create(
        {
          nombre:parametros.nombre
        }).exec(function(err,nuevoChatCreado){
          console.log('se creo el mensaje del chat: ',nuevoChatCreado);
          Chat.publishCreate(
            {
              nombre:nuevoChatCreado.nombre,
              id:nuevoChatCreado.id,
              quemado: new Date()
            });
        Chat.publishUpdate(
          {
            id:nuevoChatCreado.id
          },
          {
            nombre:nuevoChatCreado.nombre,
            quemado: new Date()
          });
        Chat.publishDestroy(
          {
            id:nuevoChatCreado.id
          });


      });

      //return res.ok();
    }
    else if (req.isSocket){

      Chat.watch(req.socket);

      console.log('valen verga mal' + req.socket.id);

    }



  }


};
