using FYP_Backend.Data;
using FYP_Backend.Models;
using FYP_Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

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

		public async Task<List<Products>> GetProducts(string name)
		{
			return await _context.Products.Where(x => x.ProductName.StartsWith(name)).ToListAsync();
		}

		public async Task RegisterUser(UserModel userModel)
		{
			var getUser = await _context.Users.Where(x => x.UserEmail == userModel.UserEmail).FirstOrDefaultAsync();

			if(getUser != null)
			{
				return;
			}
			//Generating a random salt
			byte[] salt = new byte[16];
			new RNGCryptoServiceProvider().GetBytes(salt);

			//Hashing the password with the salt using PBKDF2
			byte[] hashedPassword = new Rfc2898DeriveBytes(userModel.UserPassword, salt, 10000).GetBytes(20);

			//Converting the salt and the hashed password to base64 strings for storing in the database
			string saltString = Convert.ToBase64String(salt);
			string hashedPasswordString = Convert.ToBase64String(hashedPassword);

			//Creating a new User object with hashed password and salt
			Users user = new()
			{
				UserFullName = userModel.UserFullName,
				UserEmail = userModel.UserEmail,
				UserPassword = hashedPasswordString,
				UserTypeId = userModel.UserTypeId,
				Salt = saltString
			};

			this._context.Add(user);
			_ = await this._context.SaveChangesAsync();
		}
		public async Task<List<string>> GetAvailableStores(int id)
		{
			var availableStores = await _context.StoreProducts.Include(x => x.Store).Include(x => x.Product).Where(x => x.ProductId == id).ToListAsync();
			List<string> allStores = new();

			foreach(var item in availableStores)
			{
				string store = item.Store.StoreName;
				if (allStores.Contains(store))
				{
					continue;
				}
				else
				{
					allStores.Add(store);
				}
			}
			return allStores;
		}
	}
}
