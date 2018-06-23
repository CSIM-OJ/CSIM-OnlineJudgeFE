<template>
<div>
  <beautiful-chat :agentProfile="agentProfile" :onMessageWasSent="onMessageWasSent" :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :close="closeChat" :open="openChat" :showEmoji="true" :showFile="false" />
  <a href="#" @click.prevent="openChat()">Open the chat window</a>
</div>
</template>

<script>
export default {
  data() {
    return {
      agentProfile: {
        teamName: 'CSIM OJ Bot',
        imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
      },
      messageList: [{
          author: 'them',
          type: 'text',
          data: {
            text: 'some text'
          }
        },
        {
          author: 'me',
          type: 'text',
          data: {
            text: 'my text'
          }
        },
      ],
      newMessagesCount: 0,
      isChatOpen: false
    }
  },
  methods: {
    sendMessage(msg) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.messageList.push(msg)
        // console.log(this.messageList);
      }
    },
    onMessageWasSent(msg) {
      this.messageList.push(msg)
      console.log(this.messageList);
    },
    openChat() {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      this.isChatOpen = false
    }
  }
}
</script>
