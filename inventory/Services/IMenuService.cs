using inventory.Models;

namespace inventory.Services
{
    public interface IMenuService
    {
        // GET: IMenuService
        Task<List<Menu>> GetMenus();
    }
}
