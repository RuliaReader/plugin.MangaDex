# MangaDex Plugin  
  
A Rulia plugin for reading [MangaDex](https://mangadex.org).  
  
## Description  
  
* It works.  
* You need to customize the Http header in the plugin configuration, with the key being `User-Agent` and the value being `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0`.
* There are a lot of bugs, I'll fix them when I have time.
* There are also many shortcomings; I'll make changes when I have time.

## Login  
  
You can log in in two ways (it works without logging in):  
  
* Manually add a header named `Cookie` in the Rulia plugin settings and fill in the Cookie.  
* Use the web popup to log in, fill in `https://mangadex.org` as the URL, and log in successfully.
