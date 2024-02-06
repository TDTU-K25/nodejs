
// SEND MESSAGE
function sendMessage(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('send-message-room', conversationId, input.value, token, socket.id);
    input.value = '';

    let files = document.querySelector('#file').files;
    files = [...files]

    files.forEach(file => {
      socket.emit('send-file-room', conversationId, file, token, socket.id, file.name);
    })
    $('#previewUploadFile').html('')
    $('#previewUploadFile').css('display', 'none')
    $('#file').val('')
  }
  var messageBody = document.querySelector('.messages');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}

// RECEIVE MESSAGE
function receiveMessage(message, socketID, img, conversationID) {
  // console.log(img)
  const divItem = document.createElement('div');
  const imgTag = document.createElement('img');
  const imgTagMessage = document.createElement('img');

  if (conversationID == conversationId) {
    imgTag.src = img;
    divItem.style.position = 'relative';
    imgTag.style.position = 'absolute';
    imgTag.style.right = '100%';
    imgTag.style.width = '20px';
    imgTag.style.height = '20px'

    imgTagMessage.style.width = '30vh';

    if (socketID == socket.id)
      divItem.className = 'message send';
    else
      divItem.className = 'message recieve';
    if (message.fileType == 'image') {
      imgTagMessage.src = `data:image/png;base64,${message.content}`;
      divItem.appendChild(imgTagMessage);
    }
    else if (message.fileType == 'file') {
    const iconTag = document.createElement('i');
          iconTag.className = 'fa fa-file';
          iconTag.setAttribute('style', 'font-size: 5vh; color: #ccc;')
          const spanTag = document.createElement('span');
          spanTag.innerHTML = message.fileName;
          
          const divTag = document.createElement('div');
          divTag.setAttribute('data-id-file', message._id);
          divTag.style.display = 'inline-block';
          divTag.setAttribute('onclick', 'downloadFile(this)')
          divTag.appendChild(iconTag);
          divTag.appendChild(spanTag);
          divItem.appendChild(divTag);
    }
    else if (message.fileType == 'text') {
      divItem.innerHTML = message.content;
    }


    divItem.appendChild(imgTag);
    messages.appendChild(divItem);
    var messageBody = document.querySelector('.messages');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
}

// CREATE CONVERSATION
function createConversation(divTag, event) {
  let receiverId = $(divTag).attr('data-receiver-id');
  let img = $(divTag).find('img').attr('srcset');

  socket.emit('create-conversation', token, socket.id, receiverId);
}

function responseCreateConversation(data) {
  let conversation = data.conversation
  const { _id, members } = conversation;
  let member = members[0]

  if (members.length >= 2) {
    groupName = members.reduce((acc, cur) => {
      return acc + cur.name + ', ';
    }, '');
  }

  if (data.isExist) {
    let divTag = $('.contact-container').find(`div[data-conversation-id='${_id}']`).get(0)
    joinRoomAndloadMessageOfConversation(divTag)
    $('#addContactOne').modal('hide');
  }
  else {
    let html = `
      <div class="contact" onclick='joinRoomAndloadMessageOfConversation(this)' data-conversation-id='${_id}'>
        <div class="pic">
          <img alt="avatar" srcset="${member.avatar}" style="width: 100%">
        </div>
        <div class="badge bg-secondary text-secondary">0</div>
        <div class="name"> ${members.length >= 2 ? groupName : member.name}</div>
        <div class="message">Test</div>
      </div>`;

    $('.contact-container').append(html);
  }
}

// JOIN ROOM AND LOAD MESSAGE
function joinRoomAndloadMessageOfConversation(divContact) {
  $('.chat').css('display', 'flex');
  conversationId = $(divContact).attr('data-conversation-id');
  let img = $(divContact).find('img').attr('srcset');
  $('#avatar').html(`<img alt="avatar" srcset="${img}" style="width: 100%">`);
  socket.emit('join-room', conversationId, token);
  $('#name').text($(divContact).find('.name').text());
  messages.innerHTML = '';
  fetch('/get-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId: conversationId,
      token: token
    })
  })
    .then(response => response.json())
    .then(data => {
      let arr_msg = data.data
      arr_msg.forEach(message => {
        const { _id, content, type, fileName } = message;
        const divItem = document.createElement('div');
        
        const imgTagMessage = document.createElement('img');  
        imgTagMessage.style.width = '30vh';
        
        if (type == 'sent')
          divItem.className = 'message send';
        else
          divItem.className = 'message recieve';

        // DISPLAY IMG
        if (message.fileType == 'image') {
          imgTagMessage.src = `data:image/png;base64,${content}`;
          divItem.appendChild(imgTagMessage);
        }
        // DISPLAY FILE 
        else if (message.fileType == 'file') {
          const iconTag = document.createElement('i');
          iconTag.className = 'fa fa-file';
          iconTag.setAttribute('style', 'font-size: 5vh; color: #ccc;')
          const spanTag = document.createElement('span');
          spanTag.innerHTML = fileName;
          
          const divTag = document.createElement('div');
          divTag.setAttribute('data-id-file', _id);
          divTag.style.display = 'inline-block';
          divTag.setAttribute('onclick', 'downloadFile(this)')
          divTag.appendChild(iconTag);
          divTag.appendChild(spanTag);
          divItem.appendChild(divTag);
        }
        // DISPLAY TEST
        else if (message.fileType == 'text') {
          divItem.innerHTML = content;
        }
        
        messages.appendChild(divItem);
        messages.scrollTo(0, document.body.scrollHeight);

        var messageBody = document.querySelector('.messages');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
      });
    })
}

function createConversationMany() {
  let arr_user = [];
  $('input[name="user"]:checked').each(function () {
    arr_user.push($(this).val());
  });
  socket.emit('create-conversation', token, null, arr_user);
}
// GET ALL USER AND RENDER IN SIDEBAR
function getAllUserAndRenderInSideBar() {
  fetch('/get-all-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then(response => response.json())
    .then(data => {
      let users = data.data
      users.forEach(user => {
        let html = `
          <div class="contact" onClick="createConversation(this, event)" data-receiver-id="${user._id}">
            <div class="pic">
              <img alt="avatar" srcset="${user.avatar} 2x" style="width: 100%">
            </div>
            <div class="name"> ${user.name}</div>
            <div class="message">Test</div>
          </div>`;

        let html2 = `
          <div class="contact" data-receiver-id="${user._id}">
            <div class="pic">
              <img alt="avatar" srcset="${user.avatar} 2x" style="width: 100%">
            </div>
            <div class="name"> ${user.name}</div>
            <div class="message">Test</div>
            <div class="checkbox">
              <input type="checkbox" name="user" value="${user._id}">
            </div>
          </div>`

        $('#allUserForMany').append(html2);
        $('#allUserForOne').append(html);

      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function getAllConversationOfUser() {
  fetch('/get-all-conversation-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then(response => response.json())
    .then(data => {
      let conversations = data.data
      const senderID = data.senderID

      conversations.forEach(con => {
        let groupName = ''
        const { _id, members } = con;
        if (members.length > 2) {
          groupName = members.reduce((acc, cur) => {
            return acc + cur.name + ', ';
          }, '');


        }
        const member = members.find(member => {
          if (member._id !== senderID)
            return member;
        });
        // return;

        let html = `
          <div class="contact" onclick='joinRoomAndloadMessageOfConversation(this)' data-conversation-id='${_id}'>
            <div class="pic">
              <img alt="avatar" srcset="${member.avatar} 2x" style="width: 100%">
            </div>
            <div class="badge bg-secondary text-secondary">0</div>
            <div class="name"> ${members.length > 2 ? groupName : member.name}</div>
            <div class="message">Test</div>
          </div>`;
        $('.contact-container').append(html);
      });
    })
}

function notifiOnline(token) {
  fetch('/get-all-conversation-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then(response => response.json())
    .then(data => {
      conversations = data.data
      conversations.forEach((conversation) => {
        let divTag = $('.contact-container').find(`div[data-conversation-id='${conversation._id}']`).get(0)
        $(divTag).find('.badge').removeClass('bg-secondary text-secondary')
        $(divTag).find('.badge').addClass('bg-success text-success')
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}

function notifiOffline(token) {
  fetch('/get-all-conversation-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then(response => response.json())
    .then(data => {
      conversations = data.data
      conversations.forEach((conversation) => {
        let divTag = $('.contact-container').find(`div[data-conversation-id='${conversation._id}']`).get(0)
        $(divTag).find('.badge').removeClass('bg-success text-success')
        $(divTag).find('.badge').addClass('bg-secondary text-secondary')
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}

function logout(token) {
  window.location.href = '/login'
  localStorage.removeItem('token')
  socket.emit('logout', token)
}

function previewUploadFile() {

  const previewFile = $('#previewUploadFile')

  let files = document.querySelector('#file').files;
  files = [...files]

  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = function () {
      const imgTag = document.createElement('img');
      imgTag.style.width = '20vh';
      imgTag.src = reader.result;

      // Check file is image
      if(file.type.includes('image')){
        const divTag = document.createElement('div');
        divTag.style.display = 'inline-block';
        divTag.appendChild(imgTag);
        previewFile.append(divTag);
      }
      else {
        // SET ICON
        const iconTag = document.createElement('i');
        iconTag.className = 'fas fa-file';
        iconTag.setAttribute('style', 'font-size: 5vh; color: #ccc;')
        
        const spanTag = document.createElement('span');
        spanTag.innerHTML = file.name;
        
        const divTag = document.createElement('div');
        divTag.style.display = 'inline-block';
        divTag.appendChild(iconTag);
        divTag.appendChild(spanTag);
        previewFile.append(divTag);
      }
    }
    reader.readAsDataURL(file);

  });
  previewFile.css('display', 'block')
}

function typeMessage(conversationID, token) {
  socket.emit('typing', conversationID, socket.id, token);
}

function responseTyping(data) {
  if (data.socketID != socket.id && data.conversationID == conversationId) {
    $('#typing').css('display', 'block')
    $('#typing').text(data.name + ' is typing...')
    setTimeout(function () {
      $('#typing').css('display', 'none')
    }, 3000);
  }
}

function downloadFile(divTag) {
  const id = $(divTag).attr('data-id-file');
  fetch(`get-file-download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageID: id,
      token: token
    })
  })
  .then(response => response.json())
  .then(data => {
    const { fileName, content } = data.data;
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${content}`;
    link.download = fileName;
    link.click();
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}