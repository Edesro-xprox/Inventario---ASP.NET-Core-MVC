using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace inventory.Services
{
    public class CatalogService : ICatalogService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly ICatalogRepository _catalogRepository;

        public CatalogService(
            ApplicationDbContext db,
            IConfiguration configuration
        )
        {
            _db = db;
            _configuration = configuration;
            // create repository instance
            _catalogRepository = new CatalogRepository(db);
        }

        public async Task<List<Dictionary<string, object>>> GetCatalog(string code)
        {
            var dataTable = await _catalogRepository.getCatalog(code);
            var result = new List<Dictionary<string, object>>();

            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in dataTable.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                result.Add(dict);
            }

            return result;
        }

        public async Task<bool> InsertCatalog(string code, string name, int brandId)
        {
            var catalog = await GetCatalog(code);
            
            bool exists;
            
            if (code != "models")
            {
                exists = catalog.Any(c => (string)c["vName"] == name);
            }else{
                exists = catalog.Any(c => (string)c["vName"] == name && (int)c["iBrandId"] == brandId);    
            }

            var rows = await _catalogRepository.insertCatalog(code, name, brandId);
            return rows > 0;
        }

        public async Task<bool> UpdateCatalog(string code, int id, string name, int brandId)
        {
            var rows = await _catalogRepository.updateCatalog(code, id, name, brandId);
            return rows > 0;
        }

        public async Task<bool> ActiveCatalog(string code, string ids, bool active)
        {
            var rows = await _catalogRepository.activeCatalog(code, ids, active);
            return rows > 0;
        }

        public async Task<bool> InsertTypeEquipment(string name, string prefix, bool editPrefix, int stockMin, int stockMax)
        {
            var rows = await _catalogRepository.insertTypeEquipment(name, prefix, editPrefix, stockMin, stockMax);
            return rows > 0;
        }

        public async Task<bool> UpdateTypeEquipment(int id, string name, string prefix, bool editPrefix, int stockMin, int stockMax)
        {
            var rows = await _catalogRepository.updateTypeEquipment(id, name, prefix, editPrefix, stockMin, stockMax);
            return rows > 0;
        }
    }
}
