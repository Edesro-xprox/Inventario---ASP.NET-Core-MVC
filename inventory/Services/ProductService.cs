using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace inventory.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IProductRepository _productRepository;

        public ProductService(
            ApplicationDbContext db,
            IConfiguration configuration
        )
        {
            _db = db;
            _configuration = configuration;
            // create repository instance
            _productRepository = new ProductRepository(db);
        }

        public async Task<List<Dictionary<string, object>>> GetProducts()
        {
            var dataTable = await _productRepository.getProducts();
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

        public async Task<bool> InsertProduct(
            int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId
        )
        {
            //var product = await GetProducts();
            
            //bool exists;
            
            //if (code != "models")
            //{
            //    exists = product.Any(p => (string)p["vName"] == name);
            //}else{
            //    exists = product.Any(p => (string)p["vName"] == name && (int)p["iBrandId"] == brandId);    
            //}

            var rows = await _productRepository.insertProduct(modelId, brandId, supplierId, cost, code, description, stateId);
            return rows > 0;
        }

        public async Task<bool> UpdateProduct(
            int id, int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId
        )
        {
            var rows = await _productRepository.updateProduct(id, modelId, brandId, supplierId, cost, code, description, stateId);
            return rows > 0;
        }

        public async Task<bool> ActiveProduct(string ids, bool active)
        {
            var rows = await _productRepository.activeProduct(ids, active);
            return rows > 0;
        }
    }
}
