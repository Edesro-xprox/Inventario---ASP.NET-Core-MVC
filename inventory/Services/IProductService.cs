using inventory.Models;
using Microsoft.AspNetCore.Mvc;

namespace inventory.Services
{
    public interface IProductService
    {
        Task<List<Dictionary<string, object>>> GetProducts();
        Task<bool> InsertProduct(int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId);
        Task<bool> UpdateProduct(int id, int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId);
        Task<bool> ActiveProduct(string ids, bool active);
    }
}
