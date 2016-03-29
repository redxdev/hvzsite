# Printing

Printing is currently implemented server-side as opposed to through API endpoints. As such, there
are no endpoints specific to printing (although you can use data from admin endpoints to generate
cards). Instead, the URL `http://your-hvz-site.com/print` results in a fully rendered HTML page.
Appending the parameter `?preview=true` will result in all IDs and QR codes to not be shown.
