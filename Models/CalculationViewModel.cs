namespace KivilcimPlus.BreakCalculator.Models;

public class CalculationViewModel
{
    public List<OperatorRecord> OperatorRecords { get; set; } = new();
    public List<StandardBreak> StandardBreaks { get; set; } = new();
    public List<OutputRecord>? OutputRecords { get; set; }
    public bool IsCalculated { get; set; }
}
