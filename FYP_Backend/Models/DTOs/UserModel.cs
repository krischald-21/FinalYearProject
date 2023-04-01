namespace FYP_Backend.Models.DTOs
{
    public class UserModel
    {
        public int UserId { get; set; }
        public int UserTypeId { get; set; }
        public string UserEmail { get; set; }
        public string UserFullName { get; set; }
        public string UserPassword { get; set; }
    }
}
