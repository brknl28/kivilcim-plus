namespace KivilcimPlus.BreakCalculator.Models;

public class OperatorRecord
{
    public int KayitNo { get; set; }
    public DateTime Baslangic { get; set; }
    public DateTime Bitis { get; set; }
    public string Statu { get; set; } = string.Empty;
    public string? DurusNedeni { get; set; }

    public TimeSpan ToplamSure => Bitis - Baslangic;
}
