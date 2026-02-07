# PayTR Ödeme Entegrasyonu Kılavuzu

Bu dosya, e-ticaret sitenize PayTR ödeme altyapısını entegre etmek için gerekli adımları içerir.

## 📋 Gereksinimler

1. **PayTR Hesabı**: [PayTR'ye kaydolun](https://www.paytr.com/magaza/uye-ol)
2. **API Anahtarları**: PayTR panelinden alacağınız:
   - Merchant ID (Mağaza No)
   - Merchant Key (Mağaza Anahtarı)
   - Merchant Salt (Mağaza Gizli Anahtarı)
3. **Backend Sunucu**: PHP veya Node.js (önerilen)
4. **SSL Sertifikası**: HTTPS zorunlu (Let's Encrypt ücretsiz)

## 🔧 Backend Entegrasyonu (PHP Örneği)

### 1. PayTR Token Oluşturma Endpoint'i

`api/create-payment.php` dosyası oluşturun:

```php
<?php
// PayTR API Bilgileri (Güvenli yerde saklayın!)
$merchant_id    = 'XXXXX'; // PayTR'den aldığınız Merchant ID
$merchant_key   = 'XXXXXXXXXXXXXXXX'; // Merchant Key
$merchant_salt  = 'XXXXXXXXXXXXXXXX'; // Merchant Salt

// Form verilerini al (Frontend'den POST ile gelecek)
$user_basket = json_decode($_POST['user_basket'], true); // Sepet içeriği
$merchant_oid = "ORDER_" . rand(100000, 999999); // Benzersiz sipariş ID
$email = $_POST['email'];
$payment_amount = $_POST['payment_amount']; // Kuruş cinsinden (TL * 100)
$user_name = $_POST['user_name'];
$user_address = $_POST['user_address'];
$user_phone = $_POST['user_phone'];

// Callback ve başarı/hata URL'leri
$merchant_ok_url = "https://siteniz.com/payment-success.php";
$merchant_fail_url = "https://siteniz.com/payment-fail.php";

// Timeout limiti
$timeout_limit = "30";

// Test modu (0: Canlı, 1: Test)
$test_mode = "1"; // Testler için 1, canlıda 0 yapın

// Taksit sayısı
$no_installment = "0"; // 0: Taksit yok, 1: Taksitsiz + Taksitli
$max_installment = "0"; // Max taksit

// Dil
$user_lang = "tr";

// Crypto oluştur
$hash_str = $merchant_id . $user_ip . $merchant_oid . $email . $payment_amount . 
            $user_basket . $no_installment . $max_installment . 
            $currency . $test_mode . $merchant_salt;
$paytr_token = base64_encode(hash_hmac('sha256', $hash_str . $merchant_salt, $merchant_key, true));

// PayTR'ye gönderilecek data
$post_vals = array(
    'merchant_id' => $merchant_id,
    'user_ip' => $_SERVER['REMOTE_ADDR'],
    'merchant_oid' => $merchant_oid,
    'email' => $email,
    'payment_amount' => $payment_amount,
    'paytr_token' => $paytr_token,
    'user_basket' => json_encode($user_basket),
    'debug_on' => 1,
    'no_installment' => $no_installment,
    'max_installment' => $max_installment,
    'user_name' => $user_name,
    'user_address' => $user_address,
    'user_phone' => $user_phone,
    'merchant_ok_url' => $merchant_ok_url,
    'merchant_fail_url' => $merchant_fail_url,
    'timeout_limit' => $timeout_limit,
    'currency' => 'TL',
    'test_mode' => $test_mode,
    'lang' => $user_lang
);

// PayTR API'sine istek at
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/api/get-token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
$result = @curl_exec($ch);

if (curl_errno($ch)) {
    die("Connection error: " . curl_error($ch));
}

curl_close($ch);
$result = json_decode($result, true);

// Sonucu döndür
header('Content-Type: application/json');
if ($result['status'] == 'success') {
    echo json_encode([
        'success' => true,
        'token' => $result['token']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => $result['reason']
    ]);
}
?>
```

### 2. Callback Endpoint (Ödeme Sonucu)

`payment-callback.php` dosyası oluşturun:

```php
<?php
// PayTR'den gelen POST verisini al
$post = $_POST;

$merchant_key   = 'XXXXXXXXXXXXXXXX';
$merchant_salt  = 'XXXXXXXXXXXXXXXX';

// Hash kontrolü
$hash = base64_encode(hash_hmac('sha256', $post['merchant_oid'] . $merchant_salt . 
                                 $post['status'] . $post['total_amount'], $merchant_key, true));

if ($hash != $post['hash']) {
    die('PAYTR notification failed: bad hash');
}

// Ödeme başarılı mı kontrol et
if ($post['status'] == 'success') {
    // Siparişi veritabanına kaydet
    // Stok güncelle
    // Kullanıcıya e-posta gönder
    
    echo "OK"; // PayTR'ye başarılı yanıt
} else {
    // Ödeme başarısız
    echo "OK"; // Yine de OK döndür
}
?>
```

## 🎨 Frontend Entegrasyonu (JavaScript)

`script.js` dosyasına eklenecek kod:

```javascript
// Checkout form submit
async function initiatePayTRPayment(e) {
    e.preventDefault();
    
    // Form verilerini topla
    const formData = {
        user_name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        user_phone: document.getElementById('phone').value,
        user_address: document.getElementById('address').value + ', ' + 
                      document.getElementById('city').value + ' ' + 
                      document.getElementById('zip').value,
        user_basket: JSON.stringify(cart.map(item => [item.name, item.price, 1])),
        payment_amount: calculateTotal() * 100 // TL'yi kuruşa çevir
    };
    
    // Backend'e token isteği at
    const response = await fetch('/api/create-payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
        // PayTR iframe'i göster
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('paytr-iframe-container').style.display = 'block';
        
        // iframe oluştur
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.paytr.com/odeme/guvenli/${result.token}`;
        iframe.width = '100%';
        iframe.height = '600px';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        
        document.getElementById('paytr-iframe').appendChild(iframe);
    } else {
        alert('Ödeme başlatılamadı: ' + result.error);
    }
}
```

## 📝 Test Kartları

PayTR test modunda kullanabileceğiniz kartlar:

| Kart Numarası      | CVV | SKT   | Sonuç    |
|--------------------|-----|-------|----------|
| 5526080000000006   | 000 | 12/26 | Başarılı |
| 4766620000000001   | 000 | 12/26 | Başarılı |
| 4355084355084358   | 000 | 12/26 | Başarısız|

## 🚀 Canlıya Alma Adımları

1. ✅ Test modunda entegrasyonu tamamlayın
2. ✅ PayTR canlı API anahtarlarını alın
3. ✅ `$test_mode = "0"` yapın
4. ✅ SSL sertifikası kurun (HTTPS)
5. ✅ Callback URL'lerini doğrulayın
6. ✅ İlk test ödemesini yapın

## 📞 Destek

- PayTR Döküman: https://www.paytr.com/magaza/api-entegrasyon
- PayTR Destek: destek@paytr.com
- Telefon: 0850 885 03 85

## ⚠️ Önemli Notlar

- API anahtarlarını asla frontend kodunda tutmayın!
- Her işlem için benzersiz `merchant_oid` oluşturun
- Callback endpoint'i her zaman hash kontrolü yapmalı
- Test modunda gerçek para çekilmez
