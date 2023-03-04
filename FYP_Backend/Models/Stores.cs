using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
	public class Stores
	{
		[Key]
		public int StoreId { get; set; }
		public string? StoreName { get; set; }
	}
}
