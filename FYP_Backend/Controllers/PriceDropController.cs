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
    [ApiController]
    [Route("api/Subscribe")]
    public class PriceDropController : ControllerBase
    {
        private readonly FYP_BackendContext _context;
        private readonly IRepository _repository;

        public PriceDropController(FYP_BackendContext context, IRepository repository)
        {
            _context = context;
            _repository = repository;
        }

        // POST: api/Subscribe
        [HttpPost]
        public async Task<ActionResult<PriceDrop>> SubToPriceDrop(PriceDrop priceDrop)
        {
            bool isSubscribed = await _repository.UserSubscribed(priceDrop.UserId, priceDrop.ProductId);
            if (isSubscribed)
            {
                return NotFound();
            }
            await _repository.CreateAsync<PriceDrop>(priceDrop);
            return CreatedAtAction("GetSubscriptions", new { id = priceDrop.PriceDropId }, priceDrop);
        }


        // GET: api/Subscriptions
        [HttpGet]
        [Route("~/api/Subscriptions")]
        public async Task<ActionResult<IEnumerable<PriceDrop>>> GetSubscriptions()
        {
            return await _repository.SelectAll<PriceDrop>();
        }

        // GET: api/IsSubscribed/5/5
        [HttpGet]
        [Route("~/api/IsSubscribed/{userId}/{productId}")]
        public async Task<ActionResult<bool>> IsSubscribed(int userId, int productId)
        {
            return await _repository.UserSubscribed(userId, productId);
        }

        //DELETE: api/RemoveSubscription/5/5
        [HttpDelete]
        [Route("~/api/RemoveSubscription/{userId}/{productId}")]
        public async Task<IActionResult> DeleteSubscription(int userId, int productId)
        {
            var getSubscription = await _context.PriceDrop.Where(x => x.UserId == userId && x.ProductId == productId).FirstOrDefaultAsync();
            if (getSubscription == null)
            {
                return NotFound();
            }
            await _repository.DeleteAsync<PriceDrop>(getSubscription.PriceDropId);
            return NoContent();
        }
    }
}
