//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SubscriberWebAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class PriceHistory
    {
        public int id { get; set; }
        public int stock_id { get; set; }
        public System.DateTime time { get; set; }
        public decimal value { get; set; }
    
        public virtual Stock Stock { get; set; }
    }
}