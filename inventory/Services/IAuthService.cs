using inventory.Models;

namespace inventory.Services
{
    public interface IAuthService
    {
        /// <summary>
        /// Validate credentials and return a JWT token if successful; otherwise null.
        /// </summary>
        Task<string?> GenerateJwtTokenAsync(string username, string password);

        Task<User?> GetUserByUsernameAsync(string username);
    }
}
