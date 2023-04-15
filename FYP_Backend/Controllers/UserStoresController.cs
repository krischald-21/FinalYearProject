using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FYP_Backend.Data;
using FYP_Backend.Models;

namespace FYP_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserStoresController : ControllerBase
    {
        private readonly FYP_BackendContext _context;

        public UserStoresController(FYP_BackendContext context)
        {
            _context = context;
        }

        // GET: api/UserStores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserStore>>> GetUserStore()
        {
          if (_context.UserStore == null)
          {
              return NotFound();
          }
            return await _context.UserStore.ToListAsync();
        }

        // GET: api/UserStores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserStore>> GetUserStore(int id)
        {
          if (_context.UserStore == null)
          {
              return NotFound();
          }
            var userStore = await _context.UserStore.Where(x => x.UserId == id).FirstOrDefaultAsync();

            if (userStore == null)
            {
                return NotFound();
            }

            return userStore;
        }

        // PUT: api/UserStores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserStore(int id, UserStore userStore)
        {
            if (id != userStore.UserStoreId)
            {
                return BadRequest();
            }

            _context.Entry(userStore).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserStoreExists(id))
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

        // POST: api/UserStores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserStore>> PostUserStore(UserStore userStore)
        {
          if (_context.UserStore == null)
          {
              return Problem("Entity set 'FYP_BackendContext.UserStore'  is null.");
          }
            _context.UserStore.Add(userStore);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserStore", new { id = userStore.UserStoreId }, userStore);
        }

        // DELETE: api/UserStores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserStore(int id)
        {
            if (_context.UserStore == null)
            {
                return NotFound();
            }
            var userStore = await _context.UserStore.FindAsync(id);
            if (userStore == null)
            {
                return NotFound();
            }

            _context.UserStore.Remove(userStore);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserStoreExists(int id)
        {
            return (_context.UserStore?.Any(e => e.UserStoreId == id)).GetValueOrDefault();
        }

        [HttpGet]
        [Route("~/api/UserProducts/{userId}")]
        public IActionResult GetUserStoreProducts(int userId)
        {
            var userStoreProducts = from us in _context.UserStore
                                    join sp in _context.StoreProducts on us.StoreId equals sp.StoreId
                                    join p in _context.Products on sp.ProductId equals p.ProductId
                                    where us.UserId == userId
                                    select new { p.ProductId, p.ProductName };

            return Ok(userStoreProducts);
        }

    }
}
