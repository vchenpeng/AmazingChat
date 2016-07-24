using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AmazingChat.Server
{
    public class Message
    {
        public long ReceiverID { get; set; }
        public string Content { get; set; }
        public int Type { get; set; }
        public DateTime CreateTime { get; set; }
    }

    public class MessageViewModel : AmazingChat.Server.Entity.Message
    {
        public string Avatar { get; set; }
    }
}