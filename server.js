/*
Consigna 1:  Modificar el último entregable para que disponga de un canal de websocket que permita representar, por debajo del formulario de ingreso,
una tabla con la lista de productos en tiempo real. 
Puede haber varios clientes conectados simultáneamente y en cada uno de ellos se reflejarán los cambios que se realicen en los productos sin necesidad de recargar la vista.
Cuando un cliente se conecte, recibirá la lista de productos a representar en la vista.
>> Aspectos a incluir en el entregable:
Para construir la tabla dinámica con los datos recibidos por websocket utilizar Handlebars en el frontend. Considerar usar archivos públicos para alojar
la plantilla vacía, y obtenerla usando la función fetch( ). Recordar que fetch devuelve una promesa.
>> Consigna 2:  Añadiremos al proyecto un canal de chat entre los clientes y el servidor.
>> Aspectos a incluir en el entregable:
En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor, donde figuren los mensajes de todos los usuarios identificados por su email. 
El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY HH:MM:SS)](texto normal en marrón) : mensaje (texto italic en verde) 
Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email (obligatorio para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón. 
Los mensajes deben persistir en el servidor en un archivo (ver segundo entregable).

- https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/hamburger-fast-food-patty-bread-256.png

- https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fried-chicken-thigh-fast-food-512.png

-https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/sausage-burger-bread-breakfast-food-512.png


*/
const exp = require('constants');
const express = require('express');
const app = express();

const server = require('http').createServer(app)
const io = require('socket.io')(server , {cors: {origin:"+"}});



app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'ejs');

const products = [];

let chat = [
  {
    email:"name@gmail.com",
    message: "Welcome back",
    date: new Date().toLocaleDateString()
  }
]

app.get('/', (req, res) => {
  res.render('form.ejs', { products: products.sort((a, b) => b.price - a.price) });
});

app.post('/products', async (req, res) => {
  const { name, price, URL } = req.body;
  products.push({ name, price, URL });
  res.redirect('/');
});


io.on('connection', (socket) =>{
  console.log(`New connection id: ${socket.id}`)
  socket.emit('products', products)
  socket.emit('chat', chat)

  socket.on('newMessage', (msg) =>{
    chat.push(msg);
    socket.emit('chat', chat)
  })
  
  socket.on('newProduct', (prod) =>{
      products.push(prod);
      socket.emit('products', products)
  
  })

  socket.on("newMessage" , (msg) =>{
    chat.push(msg)
    socket.emit('chat' , chat)
  })

})

const PORT = 8080

server.listen(PORT, (req, res) => console.log(`----------- SERVER READY LISTENING IN PORT: ${PORT} ---------------`));


