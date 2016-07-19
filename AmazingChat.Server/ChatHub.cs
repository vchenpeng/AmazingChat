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
        static List<Client> _allClient = new List<Client>();

        public void Init()
        {

        }
        public void SendMessage(Message msg)
        {
            msg.CreateTime = DateTime.Now;
            _allMsg.Add(msg);
            Clients.All.Talk(msg);
            //Clients.Others.Notice(msg.UserName + " 发来消息呀");
        }

        public void Conn(string name)
        {
            Client client = new Client
            {
                ClientId = this.Context.ConnectionId,
                Name = name
            };
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
            Clients.All.Pull(_allClient);
            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            //当使用者离开时，移除在清单内的ConnectionId
            Clients.All.removeList(Context.ConnectionId);
            var client = _allClient.SingleOrDefault(x => x.ClientId == Context.ConnectionId);
            _allClient.Remove(client);
            return base.OnDisconnected(stopCalled);
        }
    }
}