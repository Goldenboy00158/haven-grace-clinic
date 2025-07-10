<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Haven Grace Medical Clinic - Compassionate Healthcare</title>
    <meta name="description" content="Haven Grace Medical Clinic provides comprehensive healthcare services with experienced physicians, modern facilities, and compassionate care for patients of all ages.">
    <meta name="keywords" content="medical clinic, healthcare, doctors, cardiology, neurology, pediatrics, orthopedics, internal medicine">

    <!-- ✅ Mpesa script should load from correct path -->
    <script src="/mpesa-standalone.js"></script>
  </head>

  <body>
    <!-- ✅ This div is where the payment UI will render -->
    <div id="payment-form"></div>

    <!-- ✅ Mpesa Initialization -->
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        if (typeof window.MpesaStandalone === "function") {
          const mpesa = new window.MpesaStandalone({
            consumerKey: 'your-key',
            consumerSecret: 'your-secret',
            businessShortCode: '174379',
            passkey: 'your-passkey',
            environment: 'sandbox'
          });
          mpesa.render('payment-form');
        } else {
        }
      });
    </script>

    <!-- ✅ Load your main Vite app -->
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>