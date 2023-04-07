using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
    public class PriceDrop
    {
        [Key]
        public int PriceDropId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
