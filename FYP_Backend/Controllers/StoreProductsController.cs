using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FYP_Backend.Data;
using FYP_Backend.Models;
using FYP_Backend.Interface;

namespace FYP_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreProductsController : ControllerBase
    {
        private readonly FYP_BackendContext _context;
        private readonly IRepository _repository;

        public StoreProductsController(FYP_BackendContext context, IRepository repository)
        {
            _context = context;
            _repository = repository;
        }

        // GET: api/Store_Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreProducts>>> GetStore_Products()
        {
            return await _repository.GetStoreProducts();
        }

        // GET: api/Store_Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreProducts>> GetStore_Products(int id)
        {
            var store_Products = await _repository.GetStoreProductsById(id);

            if (store_Products == null)
            {
                return NotFound();
            }

            return store_Products;
        }

        // PUT: api/Store_Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStore_Products(int id, StoreProducts store_Products)
        {
            if (id != store_Products.StoreProductId)
            {
                return BadRequest();
            }

            _context.Entry(store_Products).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Store_ProductsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Store_Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreProducts>> PostStore_Products(CreateStoreProducts store_Products)
        {
            var storeProduct = new StoreProducts
            {
                StoreId = store_Products.StoreId,
                ProductId = store_Products.ProductId,
                ProductLink = store_Products.ProductLink,
                Price = store_Products.Price,
            };
            _context.StoreProducts.Add(storeProduct);
            _context.SaveChanges();

            return CreatedAtAction("GetStore_Products", new { id = storeProduct.StoreProductId }, store_Products);
        }

        // DELETE: api/Store_Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore_Products(int id)
        {
            var store_Products = await _repository.SelectById<StoreProducts>(id);
            if (store_Products == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync<StoreProducts>(id);

            return NoContent();
        }

        private bool Store_ProductsExists(int id)
        {
            return _context.StoreProducts.Any(e => e.StoreProductId == id);
        }

        //GET: api/SameProduct/5
        [HttpGet]
        [Route("~/api/SameProduct/{id}")]
        public async Task<ActionResult<IEnumerable<StoreProducts>>> GetSameProducts(int id)
        {
            return await _repository.GetSameProducts(id);
        }

        //GET: api/AvailableStores/5
        [HttpGet]
        [Route("~/api/AvailableStores/{id}")]
        public async Task<ActionResult<IEnumerable<string>>> AvailableStores(int id)
        {
            return await _repository.GetAvailableStores(id);
        }
    }
}
