# Wajax (PHP & JavaScript AJAX Library)

Wajax is a powerful and lightweight library that seamlessly bridges PHP and JavaScript. It allows you to perform client-side DOM manipulations (like updating HTML, showing alerts, appending elements, redirecting, and logging to the console) directly from your backend PHP code, without writing complex AJAX callbacks or custom JavaScript handlers!

## 🚀 Features
- Manipulate the DOM directly from PHP.
- No need to write manual `$.ajax()` success/error handlers in JS.
- Automatic form data serialization.
- Simple HTML attribute integration (`w-click`, `w-form`).
- Handles alerts, confirmations, redirects, and file downloads smoothly.

---

## 📦 Installation

### Option 1: Using Composer (Recommended)
You can easily include Wajax into your PHP project via Composer.

1. Run the following command in your project directory:
   ```bash
   composer require wajax/wajax
   ```
2. Include Composer's autoloader in your PHP script:
   ```php
   require 'vendor/autoload.php';
   ```

### Option 2: Manual Installation
1. Clone or download this repository.
2. Include the `wajax.php` file in your backend script.
3. Include the `wajax.js` file in your frontend HTML.

---

## 🛠️ Usage Example

Integrating Wajax into your project is very straightforward. You only need to define your form, include the JS library, and write your PHP logic.

### 1. The Frontend (HTML & JavaScript)
Add `w-form` to your form, and `w-click="module/action"` to your button. Wajax will automatically capture the form data and send it to your server endpoint.

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Wajax Quick Start</title>
</head>
<body>

    <!-- 1. Define your form with an ID and w-form attribute -->
    <form id="loginForm" method="POST" w-form="loginForm">
        <label>Email:</label>
        <input type="email" name="email">

        <label>Password:</label>
        <input type="password" name="password">

        <!-- 2. Use w-click to point to your PHP Module / Method -->
        <!-- Format is: "ModuleName/MethodName" -->
        <button w-click="auth/login" type="button">Login</button>
    </form>

    <div id="resultBox"></div>

    <!-- 3. Include jQuery and Wajax JS -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="lib/wajax/wajax.js"></script>

    <!-- 4. Initialize Wajax -->
    <script type="text/javascript">
        $(document).ready(function () {
            // Point ajax.run to your central AJAX handler PHP file.
            ajax.run('api/ajax.php', 'ajaxStartEvent', 'ajaxFinalEvent');
        });

        function ajaxStartEvent() { /* Optional: Runs before request */ }
        function ajaxFinalEvent() { /* Optional: Runs after request completes */ }
    </script>
</body>
</html>
```

### 2. The Server Handler (`api/ajax.php`)
This file intercepts the request from the JS frontend and forwards it to the correct class (module) based on the `w-click` attribute.

```php
<?php
require_once("lib/wajax/wajax.php");

// Tell wajax to look for classes inside the 'models/' directory.
// Make sure this directory exists and contains your classes.
wajax_run('../models/', "UTF-8");
```

### 3. The Backend Logic (`models/auth/ajax.auth.php`)
This is where the magic happens. Based on `w-click="auth/login"`, Wajax will look for a file named `ajax.auth.php` inside the `models/auth/` folder and execute the `login` method of the `auth` class.

```php
<?php
// Extends your base server class that initializes $this->ajax = new wajax();
class auth extends ajax_server
{
    public function login()
    {
        // Access the posted form data using $this->filter
        $email = $this->filter['email'];
        $password = $this->filter['password'];

        if ($email === 'admin@example.com' && $password === '1234') {
            // Update HTML directly from PHP!
            $this->ajax->html('#resultBox', '<p style="color:green;">Login Successful!</p>');

            // Show a JS alert
            $this->ajax->alert("Welcome back!");

            // Redirect the user
            $this->ajax->redirect("dashboard.php");
        } else {
            $this->ajax->html('#resultBox', '<p style="color:red;">Invalid credentials.</p>');
        }
    }
}
```

*(Note: Ensure your `ajax_server` base class initializes `$this->ajax = new wajax();` as shown in the provided example inside `example/class/server.php`)*.

---

## 📚 PHP Available Methods Reference

The `wajax` PHP class provides various methods to manipulate the browser directly. Assuming `$this->ajax = new wajax();`:

### DOM Manipulation
- **`$this->ajax->html($selector, $content)`**: Replaces the inner HTML of the given `$selector`.
- **`$this->ajax->append($selector, $content)`**: Appends content to the inside of `$selector`.
- **`$this->ajax->prepend($selector, $content)`**: Prepends content to the inside of `$selector`.
- **`$this->ajax->before($selector, $content)`**: Inserts content immediately before `$selector`.
- **`$this->ajax->after($selector, $content)`**: Inserts content immediately after `$selector`.
- **`$this->ajax->remove($selector)`**: Removes the element matching `$selector` from the DOM.
- **`$this->ajax->val($selector, $value)`**: Sets the value of a form input.

### Browser Interaction
- **`$this->ajax->alert($message)`**: Triggers a standard JavaScript `alert()`.
- **`$this->ajax->confirm($message, $scriptToExecute)`**: Triggers a JS `confirm()`. If true, runs the provided JS script.
- **`$this->ajax->redirect($url)`**: Redirects the browser to `$url`.
- **`$this->ajax->console($data)`**: Logs data to the browser console.
- **`$this->ajax->console_clear($optionalData)`**: Clears the browser console.
- **`$this->ajax->script($javascriptCode)`**: Executes arbitrary raw JavaScript code in the browser.

### Utilities
- **`$this->ajax->excel($filename, $data)`**: Triggers a file download containing the provided `$data`, simulating an Excel file download.

---

## 🤝 Contributing
Contributions are welcome! Please submit a Pull Request or open an Issue if you have suggestions or bug reports.
