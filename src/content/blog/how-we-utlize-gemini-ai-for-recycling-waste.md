---
draft: false
title: "How we utilize Gemini AI for recycling waste"
thumbnail: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/IO24_WhatsInAName_SocialShare_S96SOzG.width-1300.png"
publishDate: "2025-06-28 11:39"
category: "Blog"
author: "Muh Isfhani Ghiath"
---

Running a recyclable waste platform isn't as straightforward as it sounds. At Kepul, we serve over 20K+ customers monthly across Medan and Tangerang Selatan, helping them sell everything from paper to used cooking oil through our app. While our home pickup service is convenient, the process itself? Not so much.

But Here's the thing – users have to manually add each item one by one, double-check everything, and then our drivers have to verify it all again when they arrive. It's time-consuming, frustrating, and honestly, pretty error-prone.

To improve this, we introduced #KepulPintar to streamline the process and make it better.

## #KepulPintar
#KepulPintar is a feature that can recognize recyclable waste based on images, estimate the amount of each item, and calculate the carbon footprint contribution. Not only that, we also provide a summary to describe the recognized items based on the above information and provide a single CTA button to automatically add the items directly into the cart and simplify the transaction process.

<img src="/blog/kepulpintar/1-kepul-pintar.png" alt="KepulPintar" style="width: 100%; height: auto;">

## How-to
In this experiment, we utilize the Gemini Flash model for lightweight multimodality, and Gemini CLI to improve our development experience during feature development.

### 1. Gemini CLI
Gemini CLI provides a great built-in tool as a command line interface to streamline the development process. It helps us make this feature faster than before. It's pretty simple and straightforward, as shown in the picture below:

![Gemini CLI](/blog/kepulpintar/2-gemini-cli.png)

### 1. Improve the Feature
Based on the Gemini CLI result above, the bootstrap feature is ready. Now we can integrate our internal service, which is already integrated with the Gemini API, to run the business logic for item recognition and calculation.

![Services](/blog/kepulpintar/4-simple-flow.png)

### 2. Prompts
By utilizing the Gemini Flash Model, which supports multimodality, we can send the base64 image result along with our prompt. Here's how we implement this functionality. We also integrate with our internal MCP service to gather the latest product price list based on recyclable products recognized from the attached image.

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Anda berperan sebagai seorang analis lingkungan yang bertugas menganalisis gambar sampah yang diberikan. 
            Silakan identifikasi dan kategorikan semua jenis sampah yang terlihat dalam gambar, seperti kertas, kardus, botol plastik, kaleng, dan kategori lainnya. Hitunglah jumlah item sampah untuk setiap kategori yang telah diidentifikasi. 
            Selanjutnya, buatlah estimasi kontribusi carbon footprint yang dihasilkan dari proses penguraian sampah-sampah tersebut secara keseluruhan. 
            Presentasikan hasil analisis Anda dalam dua format: pertama, tuliskan penjelasan lengkap dalam bentuk paragraf naratif yang menggambarkan temuan Anda,
            kedua, sajikan data dalam bentuk tabel yang mencantumkan daftar sampah yang berhasil diidentifikasi beserta kategorinya, jumlah item,
            dan estimasi harga berdasarkan data dari API {{kepul-price-list}}."
          },
          {
             "inlineData": {
                "mimeType": "image/jpeg",
                "data": "base64..."
             }
          }
        ]
      }
    ]
  }'
```

### 3. Result
After the experiment is done, we implement the code into our app code base. Here's the result:
```dart
class GeminiWasteAnalyzer {
  
  Future<Map<String, dynamic>> analyzeWasteImage(String base64Image) async {    
    final prompt = ...
    
    try {
      final response = await http.post(
        gemini_url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(requestBody),
      );
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw HttpException('Failed to analyze image: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error analyzing waste image: $e');
    }
  }
  
  Future<String> imageToBase64(File imageFile) async { ... }
  
  Future<WasteAnalysisResult> performWasteAnalysis(File imageFile) async {
    try {
      final base64Image = await imageToBase64(imageFile);
      final response = await analyzeWasteImage(base64Image);
      
      return WasteAnalysisResult.fromJson(response);
    } catch (e) {
      throw Exception('Analysis failed: $e');
    }
  }
}
```

![KepulPintar](/blog/kepulpintar/3-kepulpintar-final.png)

## Conclussion
The bottom line? Gemini Flash AI has made selling recyclables through Kepul much simpler. Just take a photo of your items and the Gemini handles the rest - identifying what you have and calculating quantities without any manual input needed.

With #KepulPintar, what used to be tedious is now straightforward. Our system recognizes your recyclables, calculates environmental impact, and provides instant pricing!

We believe this integration represents a significant step forward for waste management platforms and shows how AI can effectively address environmental challenges while making the process more user-friendly.

#### This feature will be available in version 2.3.0 of the app, which has been submitted to the App Console. Stay tuned for updates! ✨