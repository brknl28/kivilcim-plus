using KivilcimPlus.BreakCalculator.Models;

namespace KivilcimPlus.BreakCalculator.Data;

public static class SeedData
{
    public static List<OperatorRecord> GetOperatorRecords()
    {
        var date = new DateTime(2020, 5, 23);

        return new List<OperatorRecord>
        {
            new()
            {
                KayitNo = 1,
                Baslangic = date.Add(new TimeSpan(7, 30, 0)),
                Bitis = date.Add(new TimeSpan(8, 30, 0)),
                Statu = "Üretim",
                DurusNedeni = null
            },
            new()
            {
                KayitNo = 2,
                Baslangic = date.Add(new TimeSpan(8, 30, 0)),
                Bitis = date.Add(new TimeSpan(12, 0, 0)),
                Statu = "Üretim",
                DurusNedeni = null
            },
            new()
            {
                KayitNo = 3,
                Baslangic = date.Add(new TimeSpan(12, 0, 0)),
                Bitis = date.Add(new TimeSpan(13, 0, 0)),
                Statu = "Üretim",
                DurusNedeni = null
            },
            new()
            {
                KayitNo = 4,
                Baslangic = date.Add(new TimeSpan(13, 0, 0)),
                Bitis = date.Add(new TimeSpan(13, 45, 0)),
                Statu = "Duruş",
                DurusNedeni = "Arıza"
            },
            new()
            {
                KayitNo = 5,
                Baslangic = date.Add(new TimeSpan(13, 45, 0)),
                Bitis = date.Add(new TimeSpan(17, 30, 0)),
                Statu = "Üretim",
                DurusNedeni = null
            }
        };
    }

    public static List<StandardBreak> GetStandardBreaks()
    {
        return new List<StandardBreak>
        {
            new()
            {
                Baslangic = new TimeSpan(10, 0, 0),
                Bitis = new TimeSpan(10, 15, 0),
                DurusNedeni = "Çay Molası"
            },
            new()
            {
                Baslangic = new TimeSpan(12, 0, 0),
                Bitis = new TimeSpan(12, 30, 0),
                DurusNedeni = "Yemek Molası"
            },
            new()
            {
                Baslangic = new TimeSpan(15, 0, 0),
                Bitis = new TimeSpan(15, 15, 0),
                DurusNedeni = "Çay Molası"
            }
        };
    }
}
