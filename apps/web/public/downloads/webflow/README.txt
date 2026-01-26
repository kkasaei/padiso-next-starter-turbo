SearchFIT Webflow Integration
==============================

This integration adds the SearchFIT domain analyzer widget to your Webflow site.


INSTALLATION
------------

1. Go to your Webflow project settings
2. Navigate to "Custom Code" section
3. In the "Head Code" section, add:

   <script src="https://searchfit.ai/downloads/webflow/searchfit-embed.js"></script>


4. In your Webflow page, add an "Embed" component where you want the widget
5. Paste this code in the embed:

   <aeo-domain-input
     redirect-url="https://searchfit.ai/report"
     theme="light"
   ></aeo-domain-input>


CONFIGURATION OPTIONS
---------------------

| Attribute       | Type            | Default                      | Description                           |
|-----------------|-----------------|------------------------------|---------------------------------------|
| redirect-url    | string          | https://searchfit.ai/report  | Where to redirect after submission    |
| theme           | "light" | "dark"| "light"                      | Color theme                           |
| show-verticals  | boolean         | true                         | Show business type dropdown           |
| placeholder     | string          | "Enter your domain..."       | Custom placeholder text               |


EXAMPLES
--------

Light theme (default):
<aeo-domain-input theme="light"></aeo-domain-input>

Dark theme:
<aeo-domain-input theme="dark"></aeo-domain-input>

Custom placeholder:
<aeo-domain-input placeholder="yoursite.com"></aeo-domain-input>

Hide verticals dropdown:
<aeo-domain-input show-verticals="false"></aeo-domain-input>


CUSTOM STYLING
--------------

Override CSS variables to match your brand:

<style>
aeo-domain-input {
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --border: 214 32% 91%;
}
</style>


SUPPORT
-------

For help, contact support@searchfit.ai or visit https://searchfit.ai/docs
