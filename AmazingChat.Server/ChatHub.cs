using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using AmazingChat.Server.Entity;
using AmazingChat.Server.Utility;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;

namespace AmazingChat.Server
{
    [HubName("ChatHub")]
    public class ChatHub : Hub
    {
        public void Init()
        {

        }

        public void Map(string geohash)
        {
            string result = WebHelper.GetThirdPartyInfo(string.Format("https://m.ele.me/restapi/v4/restaurants?type=geohash&geohash={0}&offset=0&limit=20&extras[]=food_activity&extras[]=restaurant_activity", geohash));
            Clients.Caller.GetStore(result);
        }

        public void SendMessage(Message msg)
        {
            msg.CreateTime = DateTime.Now;
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                if (conn != null)
                {
                    var currentUser = db.User.Where(x => x.ID == conn.UserID && x.IsValid == true).SingleOrDefault();
                    if (msg.Type == 0)  //群聊
                    {
                        AmazingChat.Server.Entity.Message message = new AmazingChat.Server.Entity.Message
                        {
                            ID = WebHelper.GetIdentity(),
                            Content = msg.Content,
                            CreateDate = DateTime.Now,
                            Type = 0,
                            SenderID = conn.UserID,
                            SenderName = conn.UserName,
                            ReceiverID = 0,
                            IsValid = true,
                            SenderAvatar = currentUser == null ? "/images/default.jpg" : currentUser.Avatar,
                            Status = 1
                        };
                        db.Message.Add(message);
                        //foreach (User item in allUser)
                        //{
                        //    message.ReceiverID = item.ID;
                        //    db.Message.Add(message);
                        //}
                        db.SaveChanges();
                        Clients.Caller.Talk(message);
                    }
                    else if (msg.Type == 1 && msg.ReceiverID > 0 && msg.ReceiverID != 1000000000000000000)   //私聊
                    {
                        AmazingChat.Server.Entity.Message message = new AmazingChat.Server.Entity.Message
                        {
                            ID = WebHelper.GetIdentity(),
                            Content = msg.Content,
                            CreateDate = DateTime.Now,
                            Type = 1,
                            SenderID = conn.UserID,
                            SenderName = conn.UserName,
                            ReceiverID = msg.ReceiverID,
                            IsValid = true,
                            SenderAvatar = currentUser == null ? "/images/default.jpg" : currentUser.Avatar,
                            Status = 0
                        };
                        db.Message.Add(message);
                        db.SaveChanges();
                        ConnPull rConn = db.ConnPull.Where(x => x.UserID == msg.ReceiverID && x.IsValid == true).OrderByDescending(x => x.CreateDate).FirstOrDefault();

                        Clients.Caller.Talk(message);

                        if (rConn != null)
                        {
                            Clients.Client(rConn.ConnID).Notice(currentUser.Name + " 给你发送了一条消息");
                            Clients.Client(rConn.ConnID).PullFromClient();
                            Clients.Client(rConn.ConnID).Talk(message);
                        }
                    }
                    else if (msg.Type == 1 && msg.ReceiverID == 1000000000000000000)
                    {
                        AmazingChat.Server.Entity.Message message = new AmazingChat.Server.Entity.Message
                        {
                            ID = WebHelper.GetIdentity(),
                            Content = msg.Content,
                            CreateDate = DateTime.Now,
                            Type = 1,
                            SenderID = conn.UserID,
                            SenderName = conn.UserName,
                            ReceiverID = msg.ReceiverID,
                            IsValid = true,
                            SenderAvatar = currentUser == null ? "/images/default.jpg" : currentUser.Avatar,
                            Status = 1
                        };
                        db.Message.Add(message);
                        db.SaveChanges();
                        Clients.Caller.Talk(message);

                        //机器人

                        long number = 0;
                        string result = "";
                        if (long.TryParse(msg.Content, out number))
                        {
                            if (msg.Content.Length == 11 && msg.Content.Substring(0, 1) == "1")
                            {
                                result = WebHelper.GetThirdPartyInfo(string.Format("http://i.itpk.cn/api.php?question=@sjh{0}", msg.Content));
                            }
                            else if (msg.Content.Length > 6 && msg.Content.Length < 11)
                            {
                                result = WebHelper.GetThirdPartyInfo(string.Format("http://i.itpk.cn/api.php?question=@qq{0}", msg.Content));
                            }
                            else
                            {
                                result = WebHelper.GetThirdPartyInfo(string.Format("http://i.itpk.cn/api.php?question={0}", msg.Content));
                            }
                        }
                        else
                        {
                            result = WebHelper.GetThirdPartyInfo(string.Format("http://i.itpk.cn/api.php?question={0}", msg.Content));
                            if (msg.Content.Contains("喜欢") || msg.Content.Contains("爱"))
                            {
                                result = "[cqname]对[name]你才是真爱,不管你信不信，反正我信了！";
                            }
                            else if (msg.Content.Contains("笑话"))
                            {
                                Joke obj = JsonConvert.DeserializeObject<Joke>(result);
                                result = string.Format("<b>{0}</b><br />{1}", obj.title, obj.content);
                            }
                            else if (msg.Content.Contains("汪"))
                            {
                                result = "[name],你或许认识王锅锅！";
                            }
                            else if (msg.Content.Contains("王登峰") || msg.Content.Contains("锅锅"))
                            {
                                result = "我们好像在哪见过，或许高中或许昨天！";
                            }

                            result = result.Replace("[name]", string.Format(" <b>{0}</b> ", conn.UserName)).Replace("[cqname]", "俺");
                        }
                        AmazingChat.Server.Entity.Message replay = new AmazingChat.Server.Entity.Message
                        {
                            ID = WebHelper.GetIdentity(),
                            Content = result,
                            CreateDate = DateTime.Now,
                            Type = 1,
                            SenderID = msg.ReceiverID,
                            SenderName = "王锅锅",
                            ReceiverID = conn.UserID,
                            IsValid = true,
                            SenderAvatar = "/images/default.png",
                            Status = 1
                        };
                        db.Message.Add(replay);
                        db.SaveChanges();
                        Clients.Caller.Talk(replay);
                    }
                }

            }
        }

        public void Conn(long id, string name)
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = new ConnPull
                {
                    ConnID = this.Context.ConnectionId,
                    UserID = 0,
                    UserName = "",
                    CreateDate = DateTime.Now,
                    IsValid = true
                };
                var user = db.User.SingleOrDefault(x => x.ID == id);
                if (id == 0 && !string.IsNullOrEmpty(name))
                {
                    user = new User
                    {
                        ID = WebHelper.GetIdentity(),
                        Name = name,
                        DisplayName = name,
                        CreateDate = DateTime.Now,
                        RoleId = 1,
                        LastLoginDate = DateTime.Now,
                        IsValid = true
                    };
                    db.User.Add(user);

                    Clients.Caller.SetUserInfo(new
                    {
                        ID = user.ID.ToString(),
                        Name = user.Name
                    });
                    var oConn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                    if (oConn == null)
                    {
                        conn.UserID = user.ID;
                        conn.UserName = user.Name;
                        db.ConnPull.Add(conn);
                    }
                    db.SaveChanges();

                    Clients.All.Notice(name + " 上线");
                }
                else if (id > 0 && user != null)
                {
                    user.Name = name;
                    user.DisplayName = name;
                    user.LastLoginDate = DateTime.Now;
                    if (user.IsValid == false)
                    {
                        Clients.Others.Notice(name + " 上线");
                    }
                    user.IsValid = true;
                    db.Entry<User>(user).State = System.Data.EntityState.Modified;

                    Clients.Caller.SetUserInfo(new
                    {
                        ID = user.ID.ToString(),
                        Name = name
                    });
                    var oConn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                    if (oConn == null)
                    {
                        conn.UserID = user.ID;
                        conn.UserName = user.Name;
                        db.ConnPull.Add(conn);
                    }
                    db.SaveChanges();
                }
                else if (id > 0 && user == null)
                {
                    var u = new User
                    {
                        ID = id,
                        Name = name,
                        DisplayName = name,
                        CreateDate = DateTime.Now,
                        RoleId = 1,
                        LastLoginDate = DateTime.Now,
                        IsValid = true
                    };
                    db.User.Add(u);

                    Clients.Caller.SetUserInfo(new
                    {
                        ID = u.ID.ToString(),
                        Name = u.Name
                    });

                    var oConn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                    if (oConn == null)
                    {
                        conn.UserID = u.ID;
                        conn.UserName = u.Name;
                        db.ConnPull.Add(conn);
                    }
                    db.SaveChanges();

                    Clients.Others.Notice(name + " 上线");
                }
                else
                {

                }
                Clients.All.PullFromClient();
            }
        }

        public void PullAll()
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                var allOwnMsg = db.Message.Where(x => x.ReceiverID == conn.UserID && x.SenderID != conn.UserID && x.Status == 0).ToList();
                var allUser = db.User.Where(x => true).OrderByDescending(x => x.LastLoginDate).Take(100).ToList().Select(x => new
                {
                    ID = x.ID.ToString(),
                    Name = x.Name,
                    IsValid = x.IsValid,
                    Avatar = x.Avatar,
                    NotReadCount = allOwnMsg.Where(y => y.SenderID == x.ID).Count()
                }).ToList();
                Clients.Caller.Pull(allUser);
            }
        }

        public void SayHello()
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                AmazingChat.Server.Entity.Message message = new AmazingChat.Server.Entity.Message
                {
                    ID = WebHelper.GetIdentity(),
                    Content = "你好,我是王锅锅,快来找我玩耍呗！你可以尝试输入比如武汉天气，QQ号，手机号，笑话，成语等等....会有惊喜哟！！",
                    CreateDate = DateTime.Now,
                    Type = 1,
                    SenderID = 1000000000000000000,
                    SenderName = "王锅锅",
                    ReceiverID = conn.UserID,
                    IsValid = true,
                    SenderAvatar = "/images/default.png"
                };
                Clients.Caller.Talk(message);
            }
        }

        public void SetAvatar(string avatar)
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                if (conn != null)
                {
                    User user = db.User.SingleOrDefault(x => x.ID == conn.UserID);
                    if (user != null)
                    {
                        user.Avatar = avatar;
                        db.Entry<User>(user).State = System.Data.EntityState.Modified;
                        db.SaveChanges();
                    }
                }
                var allOwnMsg = db.Message.Where(x => x.ReceiverID == conn.UserID && x.SenderID != conn.UserID && x.Status == 0).ToList();
                var allUser = db.User.Where(x => true).OrderByDescending(x => x.LastLoginDate).Take(100).ToList().Select(x => new
                {
                    ID = x.ID.ToString(),
                    Name = x.Name,
                    IsValid = x.IsValid,
                    Avatar = x.Avatar,
                    NotReadCount = allOwnMsg.Where(y => y.SenderID == x.ID).Count()
                }).ToList();
                Clients.All.Pull(allUser);
            }
        }

        public void PullAllMessage(long sender = 0)
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                if (sender > 0)
                {
                    var all = db.Message.Where(x => ((x.SenderID == sender && x.ReceiverID == conn.UserID) || x.ReceiverID == sender && x.SenderID == conn.UserID) && x.Type == 1 && x.IsValid == true).OrderBy(x => x.CreateDate).Take(50).ToList();
                    var rAll = all.Where(x => x.ReceiverID == conn.UserID).ToList();
                    foreach (var item in rAll)
                    {
                        item.Status = 1;
                        item.UpdateDate = DateTime.Now;
                        db.Entry<AmazingChat.Server.Entity.Message>(item).State = System.Data.EntityState.Modified;
                    }
                    db.SaveChanges();
                    Clients.Caller.AllTalk(all);
                }
                else
                {
                    var all = db.Message.Where(x => x.Type == 0 && x.IsValid == true).OrderBy(x => x.CreateDate).Take(100).ToList();
                    Clients.Caller.AllTalk(all);
                }
            }
        }

        public void SetMsgReaded(long sender = 0)
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                if (sender > 0)
                {
                    var rAll = db.Message.Where(x => ((x.SenderID == sender && x.ReceiverID == conn.UserID)) && x.Type == 1 && x.Status == 0 && x.IsValid == true).ToList();
                    foreach (var item in rAll)
                    {
                        item.Status = 1;
                        item.UpdateDate = DateTime.Now;
                        db.Entry<AmazingChat.Server.Entity.Message>(item).State = System.Data.EntityState.Modified;
                    }
                    db.SaveChanges();
                }
            }
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            using (AmazingChatEntities db = new AmazingChatEntities())
            {
                ConnPull conn = db.ConnPull.SingleOrDefault(x => x.ConnID == this.Context.ConnectionId);
                if (conn != null)
                {
                    User u = db.User.SingleOrDefault(x => x.ID == conn.UserID);
                    u.IsValid = false;
                    conn.IsValid = false;
                    db.Entry<User>(u).State = System.Data.EntityState.Modified;
                    db.Entry<ConnPull>(conn).State = System.Data.EntityState.Modified;
                    db.SaveChanges();
                    Clients.All.PullFromClient();
                }
                //当使用者离开时，移除在清单内的ConnectionId
                return base.OnDisconnected(stopCalled);
            }
        }
    }
}