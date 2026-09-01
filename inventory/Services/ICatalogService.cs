using inventory.Models;
using Microsoft.AspNetCore.Mvc;

namespace inventory.Services
{
    public interface ICatalogService
    {
        Task<List<Dictionary<string, object>>> GetCatalog(string code);
        Task<bool> InsertCatalog(string code, string name, int brandId);
        Task<bool> UpdateCatalog(string code, int id, string name, int brandId);
        Task<bool> ActiveCatalog(string code, string ids, bool active);
    }
}
