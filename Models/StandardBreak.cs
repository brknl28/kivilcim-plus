namespace KivilcimPlus.BreakCalculator.Models;

public class StandardBreak
{
    public TimeSpan Baslangic { get; set; }
    public TimeSpan Bitis { get; set; }
    public string DurusNedeni { get; set; } = string.Empty;
}
