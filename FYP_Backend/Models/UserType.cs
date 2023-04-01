using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
	public class UserType
	{
        [Key]
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
    }
}
