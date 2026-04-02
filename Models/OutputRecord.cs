namespace KivilcimPlus.BreakCalculator.Models;

public class OutputRecord
{
    public int KayitNo { get; set; }
    public DateTime Baslangic { get; set; }
    public DateTime Bitis { get; set; }
    public TimeSpan ToplamSure => Bitis - Baslangic;
    public string Statu { get; set; } = string.Empty;
    public string? DurusNedeni { get; set; }
}
