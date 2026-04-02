# KivilcimPlus Mimari Semasi

Bu dokuman, uygulamanin katmanlarini, bagimlilik sinirlarini ve tipik istek akis yolunu kisa ve net sekilde aciklar.

## 1) Ust Seviye Gorunum

```mermaid
flowchart TB
    User[Operator] --> Browser[Tarayici]

    subgraph App[ASP.NET Core MVC Uygulamasi]
        Program[Program.cs\nDI + Middleware + Routing]
        Controller[Controllers/HomeController.cs]
        Service[Services/BreakCalculatorService.cs]
        ViewModel[Models/CalculationViewModel.cs]
    end

    subgraph UI[Sunum Katmani]
        View[Views/Home/Index.cshtml]
        Css[wwwroot/css/site.css]
        Js[wwwroot/js/site.js]
    end

    subgraph Domain[Model Katmani]
        OperatorRecord[Models/OperatorRecord.cs]
        StandardBreak[Models/StandardBreak.cs]
        OutputRecord[Models/OutputRecord.cs]
        ErrorViewModel[Models/ErrorViewModel.cs]
    end

    Seed[Data/SeedData.cs]

    Browser --> Program
    Program --> Controller
    Controller --> Service
    Controller --> ViewModel
    Controller --> View
    Service --> OperatorRecord
    Service --> StandardBreak
    Service --> OutputRecord
    Program --> Seed
    View --> Css
    View --> Js
```

## 2) Katmanlar ve Sorumluluklar

| Katman | Dosya/Folder | Sorumluluk |
|---|---|---|
| Uygulama baslangici | Program.cs | Servis kaydi, middleware sirasi, route konfigurasyonu |
| Controller | Controllers/ | HTTP istegini alir, servisleri cagirir, ViewModel hazirlar |
| Is kurallari | Services/ | Durus hesaplama mantigi ve donusum kurallari |
| Model | Models/ | Giris, cikis ve ekran model tipleri |
| Sunum | Views/ | Razor ile UI ciktisi olusturma |
| Statik kaynak | wwwroot/ | CSS/JS ve istemci tarafi davranislar |
| Ornek veri | Data/ | Varsayilan/seed veri uretimi |

## 3) Istek Akisi (Hesapla Senaryosu)

```mermaid
sequenceDiagram
    actor K as Kullanici
    participant V as Index.cshtml
    participant C as HomeController
    participant S as BreakCalculatorService
    participant VM as CalculationViewModel

    K->>V: Hesapla islemini baslatir
    V->>C: Giris kayitlari gonderilir
    C->>S: Hesaplama talebi
    S-->>C: Sonuc kayitlari ve sureler
    C->>VM: Ekran modeli olusturur
    C-->>V: ViewModel doner
    V-->>K: Tablolari render eder
```

## 4) Bagimlilik Kurallari

- Controllers, Services ve Models katmanlarini kullanabilir.
- Services katmani Views katmanina bagimli olmamalidir.
- Views yalnizca ViewModel ve gosterim gerektiren model alanlarini okumali, is kurali calistirmamalidir.
- Data/SeedData yalnizca baslangic asamasinda kullanilmali, hesaplama akisini yonetmemelidir.

## 5) Genisletme Noktalari

- BreakCalculatorService icin arayuz tanimi (ornek: IBreakCalculatorService) eklenebilir.
- Services katmanina birim testler eklenerek hesaplama kurallari guvence altina alinabilir.
- Veri kaynagi buyurse Data katmani repository/persistence ile ayrilabilir.

## 6) Dizin Ozet Haritasi

```text
/
|- Program.cs
|- Controllers/
|- Services/
|- Models/
|- Views/
|- Data/
|- wwwroot/
|- appsettings.json
|- appsettings.Development.json
```
