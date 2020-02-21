import { Socket } from "phoenix"

let socket = new Socket("/socket", { params: { token: window.userToken } })

socket.connect()

const createSocket = (topic_id) => {
  let channel = socket.channel(`comments:${topic_id}`, {})
  channel.join()
    .receive("ok", resp => {
      console.log("joined successfully", resp.comments);
      renderComments(resp.comments)
    })
    .receive("error", resp => { console.log("unable to join", resp) })

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;

    channel.push('comment:add', { content: content });
  })
};

function renderComments(comments) {
  const renderedComments = comments.map(comment => {
    return `
    <li class="collection-item">
      ${comment.content}
    </li>
    `;
  });
  document.querySelector('.collection').innerHTML = renderedComments.join('');
}

window.createSocket = createSocket;
export default socket
