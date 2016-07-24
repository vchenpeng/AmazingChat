using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AmazingChat.Server.Utility
{
    public class WebHelper
    {
        public static long GetIdentity()
        {
            byte[] buffer = Guid.NewGuid().ToByteArray();
            long long_guid = BitConverter.ToInt64(buffer, 0);
            return long_guid;
        }

        public static string GetThirdPartyInfo(string url, string charset = "utf-8")
        {
            string result = string.Empty;
            try
            {
                System.Net.WebRequest wReq = System.Net.WebRequest.Create(url);
                System.Net.WebResponse wResp = wReq.GetResponse();
                System.IO.Stream respStream = wResp.GetResponseStream();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(respStream, System.Text.Encoding.GetEncoding(charset)))
                {
                    result = reader.ReadToEnd();
                }
            }
            catch (System.Exception ex)
            {
                //Console.WriteLine(ex.Message);
            }
            return result;
        }
    }
}