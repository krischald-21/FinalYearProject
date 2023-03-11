using System.ComponentModel.DataAnnotations;

namespace FYP_Backend.Models
{
	public class StoreProducts
	{
		[Key]
		public int StoreProductId { get; set; }
		public int ProductId { get; set; }
		public Products Product { get; set; }
		public int StoreId { get; set; }
		public Stores Store { get; set; }
		public double? Price { get; set; }
		public string ProductLink { get; set; }
	}
}
