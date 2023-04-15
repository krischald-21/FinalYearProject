using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
    public class UserStore
    {
        [Key]
        public int UserStoreId { get; set; }
        public int UserId { get; set; }
        public int StoreId { get; set; }
    }
}
