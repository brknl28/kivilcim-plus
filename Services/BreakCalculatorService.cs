using KivilcimPlus.BreakCalculator.Models;

namespace KivilcimPlus.BreakCalculator.Services;

public class BreakCalculatorService
{
    public List<OutputRecord> Calculate(
        List<OperatorRecord> operatorRecords,
        List<StandardBreak> standardBreaks)
    {
        var result = new List<OutputRecord>();

        var sortedBreaks = standardBreaks
            .OrderBy(b => b.Baslangic)
            .ToList();

        var sortedRecords = operatorRecords
            .OrderBy(r => r.Baslangic)
            .ToList();

        foreach (var record in sortedRecords)
        {
            if (record.Statu == "Duruş")
            {
                result.Add(new OutputRecord
                {
                    KayitNo = record.KayitNo,
                    Baslangic = record.Baslangic,
                    Bitis = record.Bitis,
                    Statu = record.Statu,
                    DurusNedeni = record.DurusNedeni
                });
            }
            else if (record.Statu == "Üretim")
            {
                SplitProductionRecord(record, sortedBreaks, result);
            }
        }

        return result;
    }

    private void SplitProductionRecord(
        OperatorRecord record,
        List<StandardBreak> breaks,
        List<OutputRecord> result)
    {
        var currentStart = record.Baslangic;
        var recordEnd = record.Bitis;
        var recordDate = record.Baslangic.Date;

        var relevantBreaks = breaks
            .Where(b =>
            {
                var breakStart = recordDate.Add(b.Baslangic);
                var breakEnd = recordDate.Add(b.Bitis);
                return breakStart >= currentStart && breakStart < recordEnd;
            })
            .OrderBy(b => b.Baslangic)
            .ToList();

        foreach (var breakItem in relevantBreaks)
        {
            var breakStart = recordDate.Add(breakItem.Baslangic);
            var breakEnd = recordDate.Add(breakItem.Bitis);

            if (currentStart < breakStart)
            {
                result.Add(new OutputRecord
                {
                    KayitNo = record.KayitNo,
                    Baslangic = currentStart,
                    Bitis = breakStart,
                    Statu = "Üretim",
                    DurusNedeni = null
                });
            }

            result.Add(new OutputRecord
            {
                KayitNo = record.KayitNo,
                Baslangic = breakStart,
                Bitis = breakEnd,
                Statu = "Duruş",
                DurusNedeni = breakItem.DurusNedeni
            });

            currentStart = breakEnd;
        }

        if (currentStart < recordEnd)
        {
            result.Add(new OutputRecord
            {
                KayitNo = record.KayitNo,
                Baslangic = currentStart,
                Bitis = recordEnd,
                Statu = "Üretim",
                DurusNedeni = null
            });
        }
    }
}
