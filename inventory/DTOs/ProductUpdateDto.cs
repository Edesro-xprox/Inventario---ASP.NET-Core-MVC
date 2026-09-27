namespace inventory.DTOs;
public class ProductUpdateDto
{
    public int Id { get; set; }
    public int ModelId { get; set; }
    public int BrandId { get; set; }
    public int SupplierId { get; set; }
    public int CategoryId { get; set; }
    public int EmployeeId { get; set; }
    public float Cost { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int StateId { get; set; }
}