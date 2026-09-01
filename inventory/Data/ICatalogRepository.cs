using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using inventory.Models;

namespace inventory.Data
{
    public interface ICatalogRepository
    {
        Task<DataTable> getCatalog(string code);
        Task<int> insertCatalog(string code, string name, int brandId);
        Task<int> updateCatalog(string code, int id, string name, int brandId);
        Task<int> activeCatalog(string code, string ids, bool active);
    }
}
