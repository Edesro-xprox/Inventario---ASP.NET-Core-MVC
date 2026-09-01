using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using inventory.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace inventory.Data
{
    public class CatalogRepository : ICatalogRepository
    {
        private readonly ApplicationDbContext _context;

        public CatalogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DataTable> getCatalog(string code)
        {
            var dataTable = new DataTable();
            var connection = _context.Database.GetDbConnection();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "sps_catalog";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@code", code));

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader);
                }
            }
            return dataTable;
        }

        public async Task<int> insertCatalog(string code, string name, int brandId)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spi_catalog";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@code", code));
                command.Parameters.Add(new SqlParameter("@name", name));
                command.Parameters.Add(new SqlParameter("@brandId", brandId));

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
        }

        public async Task<int> updateCatalog(string code, int id, string name, int brandId)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spu_catalog";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@code", code));
                command.Parameters.Add(new SqlParameter("@id", id));
                command.Parameters.Add(new SqlParameter("@name", name));
                command.Parameters.Add(new SqlParameter("@brandId", brandId));

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
        }

        public async Task<int> activeCatalog(string code, string ids, bool active)
        {
            var connection = _context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "spu_active";
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@code", code));
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
