using System.ComponentModel.DataAnnotations;

namespace inventory.Models
{
    public class UserLogin
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
