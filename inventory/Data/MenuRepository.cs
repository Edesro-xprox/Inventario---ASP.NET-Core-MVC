using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using inventory.Models;

namespace inventory.Data
{
    public class MenuRepository : IMenuRepository
    {
        private readonly ApplicationDbContext _context;

        public MenuRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Menu>> getMenus()
        {
            var sql = "EXEC sps_menus";
            return await _context.Menus.FromSqlRaw(sql).ToListAsync();
        }
    }
}
