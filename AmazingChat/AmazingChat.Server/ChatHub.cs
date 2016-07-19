﻿using System;
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
        static List<Client> _allClient = new List<Client>();

        public void Init()
        {

        }
        public void SendMessage(Message msg)
        {
            msg.CreateTime = DateTime.Now;
            _allMsg.Add(msg);
            Clients.All.Talk(msg);
            Clients.Others.Notice(msg.UserName + " 发来消息");
        }

        public void Conn(Client client)
        {
            client.ClientId = this.Context.ConnectionId;
            _allClient.Add(client);
            Clients.Others.Notice(client.Name + " 上线");
        }

        //public void Notice(string info)
        //{
        //    IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
        //    context.Clients.All.Notice(info);
        //}

        public override System.Threading.Tasks.Task OnConnected()
        {
            return base.OnConnected();
        }
    }
}