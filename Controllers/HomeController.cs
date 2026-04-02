using Microsoft.AspNetCore.Mvc;
using KivilcimPlus.BreakCalculator.Data;
using KivilcimPlus.BreakCalculator.Models;
using KivilcimPlus.BreakCalculator.Services;

namespace KivilcimPlus.BreakCalculator.Controllers;

public class HomeController : Controller
{
    private readonly BreakCalculatorService _calculatorService;

    public HomeController()
    {
        _calculatorService = new BreakCalculatorService();
    }

    public IActionResult Index()
    {
        var viewModel = new CalculationViewModel
        {
            OperatorRecords = SeedData.GetOperatorRecords(),
            StandardBreaks = SeedData.GetStandardBreaks(),
            IsCalculated = false
        };

        return View(viewModel);
    }

    [HttpPost]
    public IActionResult Calculate()
    {
        var operatorRecords = SeedData.GetOperatorRecords();
        var standardBreaks = SeedData.GetStandardBreaks();

        var outputRecords = _calculatorService.Calculate(operatorRecords, standardBreaks);

        return Json(outputRecords.Select((r, i) => new
        {
            kayitNo = i + 1,
            baslangicDate = r.Baslangic.ToString("dd.MM.yyyy"),
            baslangicTime = r.Baslangic.ToString("HH:mm"),
            bitisDate = r.Bitis.ToString("dd.MM.yyyy"),
            bitisTime = r.Bitis.ToString("HH:mm"),
            toplamSure = FormatSure(r.ToplamSure),
            statu = r.Statu,
            durusNedeni = r.DurusNedeni ?? ""
        }));
    }

    private static string FormatSure(TimeSpan ts)
    {
        int hours = (int)ts.TotalHours;
        int minutes = ts.Minutes;
        if (hours > 0 && minutes > 0)
            return $"{hours}s {minutes}dk";
        else if (hours > 0)
            return $"{hours}s";
        else
            return $"{minutes}dk";
    }
}
