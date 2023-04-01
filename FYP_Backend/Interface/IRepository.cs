using FYP_Backend.Models;
using FYP_Backend.Models.DTOs;

namespace FYP_Backend.Interface
{
    public interface IRepository
	{
		Task<List<T>> SelectAll<T>() where T : class;
		Task<T> SelectById<T>(int id) where T: class;
		Task CreateAsync<T>(T entity) where T : class;
		Task UpdateAsync<T>(T entity) where T: class;
		Task DeleteAsync<T>(int id) where T: class;
		Task<List<StoreProducts>> GetStoreProducts();
		Task<StoreProducts> GetStoreProductsById(int id);
		Task<List<StoreProducts>> GetSameProducts(int id);
		Task<List<Products>> GetProducts(string name);
		Task RegisterUser(UserModel userModel);
	}
}
