using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace inventory.Services
{
    public class MenuService : IMenuService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IMenuRepository _menuRepository;

        public MenuService(
            ApplicationDbContext db, 
            IConfiguration configuration
        )
        {
            _db = db;
            _configuration = configuration;
            if (_menuRepository == null)
            {
                _menuRepository = new MenuRepository(db);
            }
        }

        public async Task<List<Menu>> GetMenus()
        {
            return await _menuRepository.getMenus();
        }
    }
}
