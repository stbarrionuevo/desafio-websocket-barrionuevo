const socket = io();

socket.on('connection', ()=>{
    console.log('Connection succesfully')
})


let prod = [];

socket.on('chat',(data) =>{
    prod = data
    htmlToRender = " ";

    for( let i = 0; i < prod.length; i++){
        htmlToRender = htmlToRender + `
        <tr>
        <td><h1>${prod[i].email}</h1></td>
        <td><h1>${prod[i].message}</h1></td>
        <td><h1>${prod[i].date}</h1></td>
        </tr>
        `
    }

    document.querySelector('#chat').innerHTML = htmlToRender
} )


const addMessage = (addMsg) => {
    let messageToAdd = {
        email:addMsg.email,
        message: addMsg.message,
        date: new Date().toLocaleDateString
    }

    socket.emit('newMessage', messageToAdd)
}