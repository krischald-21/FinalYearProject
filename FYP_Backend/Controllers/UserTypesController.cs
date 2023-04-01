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
    public class UserTypesController : ControllerBase
    {
		private readonly FYP_BackendContext _context;
		private readonly IRepository _repository;

		public UserTypesController(FYP_BackendContext context, IRepository repository)
		{
			_context = context;
			_repository = repository;
		}

        // GET: api/UserTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserType>>> GetUserType()
        {
          return await _repository.SelectAll<UserType>();
        }

        // GET: api/UserTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserType>> GetUserType(int id)
        {
            var userTypes = await _repository.SelectById<UserType>(id);
            if(userTypes == null)
            {
                return NotFound();
            }
            return userTypes;
        }

        // PUT: api/UserTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserType(int id, UserType userType)
        {
            if (id != userType.UserTypeId)
            {
                return BadRequest();
            }

            _context.Entry(userType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTypeExists(id))
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

        // POST: api/UserTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserType>> PostUserType(UserType userType)
        {
            await _repository.CreateAsync<UserType>(userType);
            return CreatedAtAction("GetUserType", new { id = userType.UserTypeId }, userType);
        }

        // DELETE: api/UserTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserType(int id)
        {
            var userType = await _repository.SelectById<UserType>(id);
            if(userType == null) 
            { 
                return NotFound(); 
            }
            await _repository.DeleteAsync<UserType>(id);
            return NoContent();
        }

        private bool UserTypeExists(int id)
        {
            return (_context.UserType?.Any(e => e.UserTypeId == id)).GetValueOrDefault();
        }
    }
}
