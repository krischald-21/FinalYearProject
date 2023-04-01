using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
	public class Users
	{
		[Key]
		public int UserId { get; set; }
		public int UserTypeId { get; set; }
		public string UserEmail { get; set; }
		public string UserFullName { get; set; }
		public string UserPassword { get; set; }
		public string Salt { get; set; }
	}
}
