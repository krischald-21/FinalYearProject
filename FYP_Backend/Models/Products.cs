using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
	public class Products
	{
		[Key]
		public int ProductId { get; set; }
		public string? ProductName { get; set; }
		public string? ProductBrand { get; set; }
		public string? ImgLink { get; set; }
	}
}
