//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
using System.ComponentModel.DataAnnotations;

namespace ProviderWebApi.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class PriceHistory
    {
        public int id { get; set; }
        [Required]
        public int stock_id { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public System.DateTime time { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public decimal value { get; set; }
    }
}
