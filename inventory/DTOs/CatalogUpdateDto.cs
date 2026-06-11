namespace inventory.DTOs;
public class CatalogPutDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public int Id { get; set; }
}