using Microsoft.EntityFrameworkCore;
using inventory.Models;

namespace inventory.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Menu> Menus { get; set; } = null! ;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("minvuser");
                entity.Property(u => u.UserId).HasColumnName("iUserId");
                entity.Property(u => u.Username).HasColumnName("vName");
                entity.Property(u => u.Password).HasColumnName("vPassword");
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.ToTable("pinvmenu");
                entity.Property(u => u.MenuId).HasColumnName("iMenuId");
                entity.Property(u => u.Name).HasColumnName("vName");
                entity.Property(u => u.MenuParentId).HasColumnName("iMenuParentId");
                entity.Property(u => u.Icon).HasColumnName("vIcon");
                entity.Property(u => u.Url).HasColumnName("vUrl");
                entity.Property(u => u.Order).HasColumnName("iOrder");
            });
        }
    }
}
