using System.Collections.Generic;
using System.Threading.Tasks;
using inventory.Models;

namespace inventory.Data
{
    public interface IMenuRepository
    {
        Task<List<Menu>> getMenus();
    }
}
