namespace FYP_Backend.Models.DTOs
{
    public class UserSubscription
    {
        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }
}
