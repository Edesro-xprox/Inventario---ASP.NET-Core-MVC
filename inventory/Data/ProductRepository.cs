using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using inventory.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace inventory.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DataTable> getProducts()
        {
            var dataTable = new DataTable();
            var connection = _context.Database.GetDbConnection();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "sps_product";
                command.CommandType = CommandType.StoredProcedure;

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader);
                }
            }
            return dataTable;
        }

        public async Task<int> insertProduct(int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spi_product";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@modelId", modelId));
                command.Parameters.Add(new SqlParameter("@brandId", brandId));
                command.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                command.Parameters.Add(new SqlParameter("@cost", cost));
                command.Parameters.Add(new SqlParameter("@code", code));
                command.Parameters.Add(new SqlParameter("@description", description));
                command.Parameters.Add(new SqlParameter("@stateId", stateId));

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
        }

        public async Task<int> updateProduct(int id, int modelId, int brandId, int supplierId, float cost, string code, string description, int stateId)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spu_product";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@id", id));
                command.Parameters.Add(new SqlParameter("@modelId", modelId));
                command.Parameters.Add(new SqlParameter("@brandId", brandId));
                command.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                command.Parameters.Add(new SqlParameter("@cost", cost));
                command.Parameters.Add(new SqlParameter("@code", code));
                command.Parameters.Add(new SqlParameter("@description", description));
                command.Parameters.Add(new SqlParameter("@stateId", stateId));

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
        }

        public async Task<int> activeProduct(string ids, bool active)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spu_product_active";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@ids", ids));
                command.Parameters.Add(new SqlParameter("@active", active ? 1 : 0));

                if (connection.State != ConnectionState.Open) 
                    await connection.OpenAsync();

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
        }
    }
}
