using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using inventory.Models;

namespace inventory.Data
{
    public interface IProductRepository
    {
        Task<DataTable> getProducts();
        Task<int> insertProduct(int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId);
        Task<int> updateProduct(int id, int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId);
        Task<int> activeProduct(string ids, bool active);
    }
}
