using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AmazingChat.Server
{
    public class Client
    {
        public string ClientId { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
    }
}