namespace inventory.DTOs;

public class TypeEquipmentUpdateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Prefix { get; set; } = string.Empty;
    public bool EditPrefix { get; set; }

    public int StockMin { get; set; }
    public int StockMax { get; set; }

}