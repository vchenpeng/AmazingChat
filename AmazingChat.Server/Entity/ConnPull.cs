//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace AmazingChat.Server.Entity
{
    using System;
    using System.Collections.Generic;
    
    public partial class ConnPull
    {
        public string ConnID { get; set; }
        public long UserID { get; set; }
        public System.DateTime CreateDate { get; set; }
        public bool IsValid { get; set; }
        public string UserName { get; set; }
    }
}
