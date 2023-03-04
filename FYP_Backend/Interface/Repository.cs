using FYP_Backend.Data;
using FYP_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace FYP_Backend.Interface
{
	public class Repository : IRepository
	{
		private readonly FYP_BackendContext _context;

		public Repository(FYP_BackendContext context)
		{
			_context = context;
		}
		public async Task CreateAsync<T>(T entity) where T : class
		{
			this._context.Set<T>().Add(entity);
			_ = await this._context.SaveChangesAsync();
		}

		public async Task DeleteAsync<T>(int id) where T : class
		{
			var entry = await this._context.Set<T>().FindAsync(id);
			if (entry != null)
			{
				this._context.Remove(entry);
				_ = await this._context.SaveChangesAsync();
			}
		}

		public async Task<List<T>> SelectAll<T>() where T : class
		{
			return await this._context.Set<T>().ToListAsync();
		}

		public async Task<T> SelectById<T>(int id) where T : class
		{
			return await this._context.Set<T>().FindAsync(id);
		}

		public async Task UpdateAsync<T>(T entity) where T : class
		{
			this._context.Set<T>().Update(entity);
			_ = await this._context.SaveChangesAsync();
		}
		public async Task<List<StoreProducts>> GetSameProducts(int id)
		{
			return await _context.StoreProducts.Include(x => x.Product).Include(x => x.Store).Where(x => x.ProductId == id).ToListAsync();
		}

		public async Task<List<StoreProducts>> GetStoreProducts()
		{
			return await _context.StoreProducts.Include(x => x.Product).Include(x => x.Store).ToListAsync();
		}

		public async Task<StoreProducts> GetStoreProductsById(int id)
		{
			return await _context.StoreProducts.Include(x => x.Product).Include(x => x.Store).Where(x => x.StoreProductId == id).FirstOrDefaultAsync();
		}
	}
}
