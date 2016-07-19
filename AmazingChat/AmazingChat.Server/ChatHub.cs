using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace AmazingChat.Server
{
    [HubName("ChatHub")]
    public class ChatHub : Hub
    {
        static List<Message> _allMsg = new List<Message>();

        public void SendMessage(Message msg)
        {
            msg.CreateTime = DateTime.Now;
            _allMsg.Add(msg);
            Clients.All.Talk(msg);
            Clients.All.Notice(msg);
            Notice("这是一个通知");
        }

        public void Notice(string info)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
            context.Clients.All.Notice(info);
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            return base.OnConnected();
        }
    }
}