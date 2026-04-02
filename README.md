# KivilcimPlus

KivilcimPlus, operatörün üretim/duruş kayıtlarını standart mola saatlerine göre işleyip hesaplanan çıktı tablosu üreten bir ASP.NET Core MVC uygulamasıdır.

## Ne Yapar?

- Operatör kayıtlarını (Üretim/Duruş) listeler.
- Standart mola saatlerini listeler.
- Üretim kayıtlarını molalara göre parçalara ayırır.
- Var olan duruş kayıtlarını aynen korur.
- Hesaplanan sonucu ayrı bir tabloda gösterir.

## Mimari ve Bağımlılık Yapısı

- `Program.cs`: Uygulamayı ayağa kaldırır, MVC servislerini ekler, ara katman zincirini kurar ve varsayılan yönlendirmeyi tanımlar.
- `Controllers/HomeController.cs`: Akışın giriş noktasıdır.
	- `Index`: `SeedData` üzerinden giriş verilerini alır ve görünüm modeli ile ekrana basar.
	- `Calculate`: `BreakCalculatorService` çağırır, sonucu JSON olarak döner.
- `Services/BreakCalculatorService.cs`: İş kurallarının olduğu hesaplama katmanıdır.
	- Girdi: `OperatorRecord` + `StandardBreak`
	- Çıktı: `OutputRecord`
- `Data/SeedData.cs`: Veritabanı yerine sabit örnek veriyi sağlar.
- `Views/Home/Index.cshtml` + `wwwroot/js/site.js`: Arayüz tarafı; butonla `/Home/Calculate` uç noktasına AJAX isteği gönderir ve dönen sonucu tabloya işler.

Bağımlılık akışı (kim, neye bağlı):

```text
Program.cs
	-> Yönlendirme: Home/Index ve Home/Calculate
		-> HomeController
			-> SeedData (girdi verisi)
			-> BreakCalculatorService (hesaplama kuralları)
				-> Models (OperatorRecord, StandardBreak, OutputRecord)
			-> JSON çıktı
				-> Index.cshtml + site.js (tablo gösterimi)
```

## İnşa ve Çalıştırma Süreci

1. `dotnet restore` ile NuGet bağımlılıkları çözülür.
2. `dotnet build` ile proje derlenir (`net10.0`).
3. `dotnet watch ... run` ile uygulama canlı yeniden yükleme ile başlatılır.
4. Uygulama açıldığında `Index` çalışır, kullanıcı Hesapla'ya bastığında `Calculate` uç noktası tetiklenir.

## Proje Yapısı (Kısa)

- `Program.cs`: Başlangıç ve yönlendirme tanımları
- `Controllers/HomeController.cs`: Sayfa ve hesaplama uç noktası
- `Services/BreakCalculatorService.cs`: Hesaplama motoru
- `Data/SeedData.cs`: Örnek veri kaynağı
- `Models/`: Veri modelleri
- `Views/Home/Index.cshtml`: Ana ekran
- `wwwroot/`: Statik dosyalar (CSS/JS)

## Yerelde Çalıştırma

Gereksinim: .NET 10 SDK

```bash
dotnet restore KivilcimPlus.sln
dotnet build KivilcimPlus.sln
dotnet watch --project KivilcimPlus.BreakCalculator.csproj run --launch-profile http
```

Varsayılan adres: http://localhost:5059
