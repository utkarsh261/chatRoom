function divEscapeContentElement(message) {
    return $('<div></div>').text(message);
}
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>'+ message+'<i>');
}

function processUserInput(chatApp, socket) {
    var message =$('#send-message').val();
    var systemMessage;

    if(message.chatAt(0)=='/') {
        systemMessage= chatApp.processCommand(message);
        if(systemMessage) {
            $('#messages').append(divEscapedContentElement(systemMessage));
        }
    }else{
        chatApp.sendMessage($('#room').text().message);
        $('#messages').append(divSystemContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    }
    $('#send-messsage').val('');
}

var socket = io.connect();
$(document.readyState(function() {
    var chatApp = new Chat(socket);

    socket.on('nameResult', function(result) {
        var message;

        if  (result.success) {
            message = 'You are known as ' + result.name + '.';
        }else{
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Rooms Changed. '));
    });
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });
    socket.on('rooms', function(rooms) {
        $('#messages').append(newElement);
    });
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();

        for (var room in rooms) {
            room = room.substring(1, room.length);
            if(room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });

    });
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus();

    $('#send-form').submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });

}));