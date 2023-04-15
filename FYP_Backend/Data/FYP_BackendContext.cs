using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FYP_Backend.Models;

namespace FYP_Backend.Data
{
    public class FYP_BackendContext : DbContext
    {
        public FYP_BackendContext (DbContextOptions<FYP_BackendContext> options)
            : base(options)
        {
        }

        public DbSet<FYP_Backend.Models.Stores> Stores { get; set; } = default!;

        public DbSet<FYP_Backend.Models.Products> Products { get; set; }

        public DbSet<FYP_Backend.Models.StoreProducts> StoreProducts { get; set; }

        public DbSet<FYP_Backend.Models.UserType>? UserType { get; set; }

        public DbSet<FYP_Backend.Models.Users>? Users { get; set; }
        public DbSet<PriceDrop>? PriceDrop { get; set; }
        public DbSet<FYP_Backend.Models.UserStore>? UserStore { get; set; }
    }
}
