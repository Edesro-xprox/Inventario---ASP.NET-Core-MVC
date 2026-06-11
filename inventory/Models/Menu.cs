using System.ComponentModel.DataAnnotations;

namespace inventory.Models
{
    public class Menu
    {
        [Key]
        public int MenuId { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        public int MenuParentId { get; set; }
        public string Icon { get; set; } = null;
        [Required]
        public string Url { get; set; } = null!;
        public int Order { get; set; } = 0;
    }
}
